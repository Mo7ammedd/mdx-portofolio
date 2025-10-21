export function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who is Mohammed Mostafa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Mohammed Mostafa (also known as Mohammed) is an experienced Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript. He is a backend engineer and full-stack developer from Egypt, graduated from Suez Canal University with a Computer Science degree.',
        },
      },
      {
        '@type': 'Question',
        name: 'Who is Mohammed Software Engineer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Mohammed Software Engineer refers to Mohammed Mostafa, an experienced backend and full-stack developer specializing in ASP.NET Core, Node.js, and TypeScript. He builds scalable systems and microservices architectures.',
        },
      },
      {
        '@type': 'Question',
        name: 'What technologies does Mohammed Mostafa work with?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Mohammed Mostafa works with ASP.NET Core, Node.js, TypeScript, C#, Express.js, Azure Cloud, SQL Server, Redis, microservices architecture, and RESTful APIs. He specializes in backend development and full-stack solutions.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is Mohammed Mostafa located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Mohammed Mostafa is based in Egypt and available for remote software engineering opportunities worldwide.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Mohammed Mostafa available for hire?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Mohammed Mostafa is currently available for software engineering opportunities, freelance projects, and contract work. Contact him at mohammedmostafanazih@gmail.com.',
        },
      },
    ],
  }
}
