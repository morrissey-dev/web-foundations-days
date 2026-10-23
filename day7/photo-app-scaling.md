SnapShare Scaling Plan
1. Assumptions
- SnapShare has 10 million registered users.
- 10% of registered users are active each day.
- Each daily active user uploads 1 photo per day.
- Each daily active user views 50 feed pages per day.
- An original photo averages 2 MB.
- Each original photo also gets a 50 KB thumbnail.
- Use 86,400 seconds per day and 365 days per year.
- For peak feed traffic, estimate 5 times the average.
- For storage estimates, use decimal units: 1 MB = 1,000 KB and 1 TB = 1,000,000 MB.
- Storage estimates cover one year of new original photos and thumbnails only; they do not include replication, backups, metadata, or other overhead.
2. Traffic and storage estimates
Daily active users
Daily active users = 10,000,000 registered users × 10%

= 1,000,000 daily active users (DAU)
Photo uploads per second
Uploads per day = 1,000,000 DAU × 1 upload per user

= 1,000,000 uploads per day

Average uploads per second = 1,000,000 ÷ 86,400

= about 11.6 uploads per second (approximately 12)
Feed views per second
Feed views per day = 1,000,000 DAU × 50 feed pages per user

= 50,000,000 feed views per day

Average feed views per second = 50,000,000 ÷ 86,400

= about 579 feed views per second

Peak feed views per second = 579 × 5

= about 2,895 feed views per second (approximately 2,900)
Photo storage per year
Original photo storage per day = 1,000,000 uploads × 2 MB

= 2,000,000 MB = 2 TB per day

Original photo storage per year = 2 TB × 365

= 730 TB per year

Thumbnail storage per day = 1,000,000 thumbnails × 50 KB

= 50,000,000 KB = 50 GB per day

Thumbnail storage per year = 50 GB × 365

= 18.25 TB per year

Total new photo and thumbnail storage per year = 730 TB + 18.25 TB

= 748.25 TB per year, or roughly 748 TB/year.

This is the estimated storage for one year's uploads before replication, backups, retention policies, or storage overhead.
3. Read-heavy or write-heavy?
SnapShare is read-heavy. Each daily active user uploads one photo but views 50 feed pages, so feed reads happen much more often than photo uploads.

The design should therefore make feed reads fast and efficient by using a CDN for photo delivery, a cache for frequently requested feed data, and a database read replica for additional read traffic. Uploads still need a reliable write path to the primary database and object storage.
4. Why photos should not be stored inside the database
Photo files are large binary objects. Storing every original photo and thumbnail directly in the main database would make the database grow quickly, increase backup and replication costs, and compete with feed metadata queries for database resources.

Instead, store the original photos and thumbnails in object storage. Keep their object keys or URLs, ownership, captions, timestamps, and other searchable metadata in the database. This lets the database manage structured data while object storage handles large files efficiently.

5. Architecture diagram
                         +----------------------+
                         | Users / mobile apps  |
                         +----------+-----------+
                                    |
                         +----------v-----------+
                         |         DNS          |
                         +----------+-----------+
                                    |
                      +-------------+--------------+
                      |                            |
            Static app files                 API requests
                      |                            |
             +--------v--------+          +--------v---------+
             | CDN             |          | Load balancer    |
             | HTML/CSS/JS and |          +--------+---------+
             | photo delivery  |                   |
             +-----------------+          +--------+--------+
                                          |        |        |
                                      +---v--+ +---v--+ +---v--+
                                      | App 1| | App 2| | App 3|
                                      +--+---+ +---+--+ +--+---+
                                         |         |       |
                            +------------+---------+-------+-----------+
                            |                      |                   |
                      +-----v------+         +-----v------+      +-----v------+
                      | Cache      |         | Primary DB |      | Job queue  |
                      | (Redis)    |         | metadata   |      |            |
                      +------------+         +-----+------+      +-----+------+
                                                   |                   |
                                            replication                 |
                                                   |                   v
                                            +------v------+      +------------+
                                            | Read replica|      | Thumbnail  |
                                            | metadata    |      | worker     |
                                            +-------------+      +------+-----+
                                                                       |
                                                            +----------v----------+
                                                            | Object storage      |
                                                            | original photos and |
                                                            | generated thumbnails|
                                                            +---------------------+
The CDN serves static application files and cached photo objects to users. The object storage bucket is the durable home for original photos and generated thumbnails; the database stores metadata and references to those objects.
6. What each component solves
- Users / mobile apps: Provide the interface through which people upload photos and browse their feeds.
- DNS: Resolves SnapShare's domain name so clients can find the service.
- CDN: Delivers static files and cached photo content from edge locations closer to users, reducing latency and origin traffic.
- Load balancer: Sends API requests to healthy app servers and prevents one server from receiving all the traffic.
- App servers: Authenticate users, validate uploads, manage feed requests, and coordinate database, cache, object-storage, and queue operations.
- Cache (Redis): Stores frequently requested feed data or metadata so the app can avoid repeating expensive database queries.
- Primary database: Stores authoritative structured data such as users, photo metadata, follow relationships, and feed-related records, and accepts writes.
- Read replica: Serves eligible database reads to reduce load on the primary, while accounting for possible replication lag.
- Object storage: Stores the large original photo files and thumbnail files separately from the database.
- Job queue: Holds thumbnail-generation jobs so uploading a photo does not have to wait for image processing to finish.
- Thumbnail worker: Takes jobs from the queue, creates smaller thumbnail images, saves them to object storage, and updates the photo metadata when appropriate.
7. Step-by-step photo upload flow
 1. A user selects a photo in the SnapShare app and submits an upload request.
 2. The request reaches the load balancer, which forwards it to a healthy app server.
 3. The app server authenticates the user and validates the upload, including file type and size.
 4. The original photo is saved to object storage. For very large scale, the app can issue a short-lived, authorised upload URL so the client uploads directly to object storage rather than sending the whole file through the app server.
 5. The app server writes a photo record to the primary database, including the owner, object key, timestamp, and processing status.
 6. The app server adds a thumbnail-generation job to the queue, referring to the stored original photo.
 7. The API responds that the upload has been accepted or created; it does not need to wait for thumbnail generation to finish.
 8. A thumbnail worker consumes the queued job, reads the original from object storage, generates a 50 KB thumbnail, and saves it back to object storage.
 9. The worker updates the photo record to show that the thumbnail is ready. If processing fails, the job can be retried with limits and back-off.
 10. When followers view their feeds, the app returns feed metadata and thumbnail references; the CDN delivers the thumbnail or original photo content.
 
 The implementation should handle partial failures—for example, cleaning up an uploaded object if the metadata write fails—and use idempotent job processing to avoid duplicate thumbnail records or work.
 
 8. Trade-offs
Trade-off 1: Fast feed reads vs. freshness
Caching feed data and using a read replica can make feed pages faster and reduce primary database load. However, cached feeds or replicas may briefly be out of date after a new upload or follow change. SnapShare can accept short delays for many feed updates, while using cache invalidation or short TTLs to limit staleness.
Trade-off 2: Asynchronous thumbnails vs. immediate completeness
Putting thumbnail creation on a queue lets the upload response return quickly and absorbs bursts of uploads. The trade-off is that a thumbnail may not be ready immediately, and the queue or worker can fail. The app should show a processing placeholder and monitor queue depth, worker failures, and job age.
Trade-off 3: Object storage and CDN vs. cost and complexity
Object storage and a CDN handle large photo files efficiently and reduce the load on app servers and the database. They add storage, CDN-transfer, cache-invalidation, access-control, and lifecycle-management costs.
Trade-off 4: Replicas and redundancy vs. operating cost
A read replica can support feed traffic and provide another copy of database data, but it costs money and may lag behind the primary. The system must decide which reads can tolerate replica lag and which require fresher data from the primary.

Summary
SnapShare has an estimated 1 million daily active users, about 12 uploads per second, about 579 average feed views per second, and about 2,900 peak feed views per second. One year of new originals and thumbnails requires approximately 748 TB before backups and other overhead. Since the app is read-heavy, the design uses a CDN, cache, and read replica for efficient feed delivery, while object storage holds photo files and a queue with workers generates thumbnails asynchronously.                                                           