using System.Collections;
using System.Diagnostics;
using System.Runtime.InteropServices;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

static void Check(bool condition, string message)
{
    if (!condition) throw new Exception(message);
}

Console.WriteLine(RuntimeInformation.FrameworkDescription);
Console.WriteLine("ASP.NET Core " + FileVersionInfo.GetVersionInfo(typeof(WebApplication).Assembly.Location).ProductVersion);

int number = 42;
object boxed = number;
number = 99;
Check((int)boxed == 42, "Boxing must copy the value");
bool invalidCast = false;
try { _ = (long)boxed; } catch (InvalidCastException) { invalidCast = true; }
Check(invalidCast, "Unboxing requires the exact stored value type");
ArrayList objects = new();
List<int> values = new();
for (int i = 0; i < 1_000; i++) { objects.Add(i); values.Add(i); }
Check(objects.Count == values.Count && (int)objects[999]! == values[999], "Collection examples must keep the same values");
Console.WriteLine("PASS: copied boxing value, exact-type unboxing, invalid cast, ArrayList and List<int> values");

var builder = WebApplication.CreateBuilder();
builder.Logging.ClearProviders();
builder.WebHost.UseKestrel().UseUrls("http://127.0.0.1:0");
builder.Services.AddSingleton<RequestTrace>();
builder.Services.AddTransient<FactoryMiddleware>();
await using var app = builder.Build();
var trace = app.Services.GetRequiredService<RequestTrace>();
app.Use(async (HttpContext context, RequestDelegate next) =>
{
    trace.Events.Add("inline:before");
    var timer = Stopwatch.StartNew();
    context.Response.OnStarting(() =>
    {
        context.Response.Headers["X-Response-Time"] = timer.ElapsedMilliseconds.ToString();
        return Task.CompletedTask;
    });
    await next(context);
    trace.Events.Add("inline:after");
    trace.Complete.TrySetResult();
});
app.UseMiddleware<ConventionalMiddleware>();
app.UseMiddleware<FactoryMiddleware>();
app.Run(async context => { trace.Events.Add("endpoint"); await context.Response.WriteAsync("ok"); });
await app.StartAsync();
try
{
    var addresses = app.Services.GetRequiredService<IServer>().Features.Get<IServerAddressesFeature>()!;
    using var client = new HttpClient { BaseAddress = new Uri(addresses.Addresses.Single()) };
    for (int request = 0; request < 2; request++)
    {
        trace.Events.Clear();
        trace.Complete = new(TaskCreationOptions.RunContinuationsAsynchronously);
        using var response = await client.GetAsync("/example");
        Check(response.IsSuccessStatusCode && await response.Content.ReadAsStringAsync() == "ok", "Endpoint must write a successful response");
        Check(response.Headers.Contains("X-Response-Time"), "Timing header must be set before response starts");
        await trace.Complete.Task.WaitAsync(TimeSpan.FromSeconds(5));
        Check(trace.Events.SequenceEqual(new[] { "inline:before", "class:before", "factory:before", "endpoint", "factory:after", "class:after", "inline:after" }), "Middleware must unwind in reverse order");
    }
    Check(ConventionalMiddleware.Instances == 1, "Conventional middleware must be constructed once");
    Check(FactoryMiddleware.Instances == 2, "Transient IMiddleware must be resolved for each request");
    Console.WriteLine("PASS: live HTTP response timing header, delegate order, conventional activation, transient IMiddleware activation");
}
finally { await app.StopAsync(); }

sealed class RequestTrace
{
    public List<string> Events { get; } = new();
    public TaskCompletionSource Complete { get; set; } = new(TaskCreationOptions.RunContinuationsAsynchronously);
}

sealed class ConventionalMiddleware
{
    public static int Instances;
    private readonly RequestDelegate next;
    public ConventionalMiddleware(RequestDelegate next) { this.next = next; Instances++; }
    public async Task InvokeAsync(HttpContext context, RequestTrace trace)
    {
        trace.Events.Add("class:before");
        await next(context);
        trace.Events.Add("class:after");
    }
}

sealed class FactoryMiddleware(RequestTrace trace) : IMiddleware
{
    public static int Instances;
    private readonly int instance = Interlocked.Increment(ref Instances);
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        _ = instance;
        trace.Events.Add("factory:before");
        await next(context);
        trace.Events.Add("factory:after");
    }
}
