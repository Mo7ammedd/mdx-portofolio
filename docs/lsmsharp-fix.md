# LSMSharp fix and CV substitution

Completed 11 November 2026 at your request. LSMSharp replaces GhostyKey in the final CV. This is a **Codex-assisted source fix, now published**, based on commit `a8686cf696add5988008d9a88d65a41a514df77b`, published as [e70fe08](https://github.com/Mo7ammedd/LSMSharp/commit/e70fe08fcd3cbbd16f7a83d7640a987f7c8d309f). The original audit failures remain valid for the unpatched base commit.

Working tree: `/home/mohammed/mohammed/projects/LSMSharp`. GitHub commit: [e70fe08](https://github.com/Mo7ammedd/LSMSharp/commit/e70fe08fcd3cbbd16f7a83d7640a987f7c8d309f). The portable [source patch](lsmsharp-local-fix.patch) was checked with `git apply --check` against an untouched archive of the base commit. Pre-existing executable-bit changes were preserved in the working tree and omitted from the patch.

## Causes and changes

1. **SSTable cursor race.** Concurrent reads called `Seek` and then awaited reads on the same cached stream. A different request could move the cursor, producing missing/wrong values or invalid compressed bytes. `SSTable/SSTable.cs` now uses `RandomAccess.ReadAsync` with explicit offsets, loops until the recorded block length is filled, and rejects invalid persisted offsets/lengths before allocation/decoding. Footer, metadata, index, and data-block reads share that helper. On-disk format is unchanged.
2. **Skip-list insertion race.** Writers computed predecessor nodes under a read lock, released it, then inserted under a write lock. Another writer could change the topology/height in between, leaving stale or missing predecessors. `SkipList/ConcurrentSkipList.cs` now holds the write lock across search and mutation. This trades parallel writers for correct serialization while retaining shared readers; it is not lock-free or a throughput improvement claim.
3. **Null-key contract and test reporting.** `LSMTreeDB.cs` now throws `ArgumentNullException` for null write/delete keys, matching the existing functional expectation. `Tests/FunctionalTests.cs` now fails on incomplete final integrity or edge-case verification instead of printing a failure and returning success.
4. **Root demo build.** `LSMTree.csproj` excludes the standalone benchmark entry point. `Program.cs` no longer references test classes that the demo project excludes; test arguments direct callers to the separate test project. The demo remains the default executable. README/test instructions describe the actual test command and bounded guarantees.

## Verification actually run

All executions used isolated source copies; no existing database was opened or deleted.

| Check | Original implementation | Patched implementation |
| --- | --- | --- |
| Concurrent uncached block reads | New regression failed with an incorrect value/missing key. Earlier functional runs failed decoding compressed blocks. | 4,096 lookups across 32 readers plus simultaneous enumeration passed. |
| Concurrent skip-list writers | New regression reproduced `NullReferenceException` in insertion. | 32 writers retained 4,096 unique sorted keys, then three synchronized phases of updates passed. |
| Persisted block bounds | New assertion cases added. | Invalid large offsets, oversized lengths, and empty blocks rejected. |
| Compaction and clean reopen | Original concurrent read failure prevented a reliable pass. | Byte-for-byte concurrent verification, updates/deletion, and clean reopen passed. |
| Existing functional suite | Previous runs failed integrity; the first partially fixed run also exposed a null-key mismatch. | Exit 0, no failure output; final integrity 200/200, edge cases 8/8. |
| Repeat storage checks | Not represented as a baseline pass. | Four strict scenarios passed in each of five additional invocations. |
| Root engine/demo build | Multiple entry points and excluded test-class references prevented building. | `dotnet build LSMTree.csproj` succeeds. Four existing nullable warnings in LevelManager remain. |

Commands from the repository root:

```sh
dotnet build LSMTree.csproj
dotnet run --project Tests/Tests.csproj -- functional
dotnet run --project Tests/Tests.csproj -- storage
```

New assertions are in `Tests/StorageRegressionTests.cs`; the functional/default runner includes them. Exact execution states, source hashes, patch hash, and historical failures are preserved in [repository-test-results.json](repository-test-results.json).

## Limits and CV treatment

The patch fixes the reproduced concurrent I/O and skip-list defects. It does **not** establish ACID transactions, per-write fsync, crash-safe manifest publication, arbitrary concurrent flush/compaction correctness, safe cache eviction while readers are active, production operation, or benchmark throughput. WAL batching, timestamp-based file names, compaction/tombstone lifetime rules, and recovery ordering still warrant separate investigation. The performance/stress suites were not run or claimed to pass.

The CV therefore calls LSMSharp an **experimental storage engine** and describes WAL, skip lists, SSTables, Bloom filters, compaction, prefix encoding, GZip, block caching, and bounded tests. The new checks are not backdated into earlier repository history or described as a production release. The GitHub repository now contains the published fix [e70fe08](https://github.com/Mo7ammedd/LSMSharp/commit/e70fe08fcd3cbbd16f7a83d7640a987f7c8d309f).

The CV rating remains **89/100**. Selecting stronger storage-internals evidence for your target role does not erase the remaining operational, attribution, or senior-accountability gaps. GhostyKey remains a credible alternative in [the updated ranking](project-ranking.md).
