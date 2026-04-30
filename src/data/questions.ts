export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: number;
  topic: string;
  topicLabel: string;
  subtopic: string;
  difficulty: Difficulty;
  question: string;
  answer: string;
  proTip: string;
  codeSnippet?: string;
  tags: string[];
  resumeLink?: string;
}

export interface Topic {
  id: string;
  label: string;
  description: string;
  icon: string;
  accent: string;
}

export const topics: Topic[] = [
  { id: "core-java", label: "Core Java 8/11", description: "OOP, Streams, Lambdas, Memory, Threads", icon: "Coffee", accent: "from-orange-500 to-amber-500" },
  { id: "spring", label: "Spring Boot & Spring Core", description: "DI, AOP, REST, Profiles, Banking APIs", icon: "Leaf", accent: "from-green-500 to-emerald-500" },
  { id: "microservices", label: "Microservices Architecture", description: "Discovery, Gateway, Circuit Breaker, Caching", icon: "Network", accent: "from-blue-500 to-cyan-500" },
  { id: "rest-api", label: "REST API Design", description: "HTTP, Versioning, Validation, Swagger", icon: "Globe", accent: "from-sky-500 to-blue-500" },
  { id: "hibernate-jpa", label: "Hibernate / JPA", description: "Mappings, Lazy/Eager, JPQL, Transactions", icon: "Database", accent: "from-teal-500 to-cyan-500" },
  { id: "dsa", label: "Data Structures & Algorithms", description: "Arrays, Trees, Graphs, DP, Heaps", icon: "Binary", accent: "from-fuchsia-500 to-pink-500" },
  { id: "sql-db", label: "SQL & Databases", description: "MySQL, PostgreSQL, MongoDB, Indexing", icon: "Server", accent: "from-indigo-500 to-violet-500" },
  { id: "react", label: "React.js & Frontend", description: "Hooks, Virtual DOM, Redux, Performance", icon: "Atom", accent: "from-cyan-500 to-blue-500" },
  { id: "aws", label: "AWS & Cloud Deployment", description: "EC2, ALB, Auto Scaling, CI/CD", icon: "Cloud", accent: "from-amber-500 to-yellow-500" },
  { id: "websocket", label: "WebSocket & Real-Time", description: "STOMP, Scaling, BarathAI Chat", icon: "Radio", accent: "from-rose-500 to-red-500" },
  { id: "auth-security", label: "Authentication & Security", description: "JWT, bcrypt, Spring Security, OAuth", icon: "ShieldCheck", accent: "from-red-500 to-orange-500" },
  { id: "design-patterns", label: "Design Patterns & System Design", description: "SOLID, Singleton, Factory, System Design", icon: "Boxes", accent: "from-purple-500 to-indigo-500" },
  { id: "devops", label: "Git, CI/CD & DevOps", description: "Git flows, GitHub Actions, Maven, Gradle", icon: "GitBranch", accent: "from-slate-500 to-gray-600" },
  { id: "coding-challenges", label: "Coding Challenges", description: "LRU, Reverse list, Two Sum, Merge intervals", icon: "Code2", accent: "from-pink-500 to-rose-500" },
  { id: "projects", label: "My Projects (Resume)", description: "KUWY, BarathAI Chat, AI English Tutor", icon: "Briefcase", accent: "from-violet-500 to-purple-500" },
];

const Q = (q: Question): Question => q;
let _id = 0;
const next = () => ++_id;

export const questions: Question[] = [
  // ============ CORE JAVA 8/11 (12) ============
  Q({ id: next(), topic: "core-java", topicLabel: "Core Java 8/11", subtopic: "OOP", difficulty: "easy",
    question: "Explain the four pillars of OOP with real Java examples.",
    answer: "**Encapsulation** — bundle state with behavior, expose via methods (private fields + getters/setters). **Inheritance** — `extends` reuses behavior; e.g. `class SavingsAccount extends Account`. **Polymorphism** — same interface, different behavior; compile-time (overloading) and runtime (overriding via dynamic dispatch). **Abstraction** — hide implementation behind abstract classes/interfaces; e.g. `PaymentGateway` interface with `Razorpay`/`Stripe` implementations.",
    proTip: "Follow-up trap: 'Difference between abstract class and interface in Java 8+?' — interfaces now allow `default` and `static` methods, but only abstract classes can have constructors and instance state.",
    codeSnippet: `interface PaymentGateway { void pay(double amt); }
class Razorpay implements PaymentGateway {
    public void pay(double amt) { /* call API */ }
}
PaymentGateway pg = new Razorpay(); // polymorphism
pg.pay(1000);`,
    tags: ["oop", "polymorphism"], resumeLink: "Java backend at KUWY" }),

  Q({ id: next(), topic: "core-java", topicLabel: "Core Java 8/11", subtopic: "Streams", difficulty: "medium",
    question: "Explain Java 8 Streams and the difference between intermediate and terminal operations.",
    answer: "Streams are a functional pipeline over a data source (Collection, array, I/O). **Intermediate** ops (`filter`, `map`, `sorted`, `distinct`) return a new Stream and are **lazy** — they don't execute until a terminal op runs. **Terminal** ops (`collect`, `forEach`, `reduce`, `count`) trigger evaluation and produce a result/side effect. Streams can be sequential or `parallel()` for multi-core processing.",
    proTip: "Don't reuse a stream — once a terminal op runs, the stream is consumed. Calling another op throws `IllegalStateException`.",
    codeSnippet: `List<String> active = users.stream()
    .filter(User::isActive)
    .map(User::getName)
    .sorted()
    .collect(Collectors.toList());`,
    tags: ["streams", "java8"] }),

  Q({ id: next(), topic: "core-java", topicLabel: "Core Java 8/11", subtopic: "Functional Interfaces", difficulty: "medium",
    question: "What are the four core functional interfaces in java.util.function?",
    answer: "**Predicate<T>** — `boolean test(T)`, used in `filter`. **Function<T,R>** — `R apply(T)`, used in `map`. **Consumer<T>** — `void accept(T)`, used in `forEach`. **Supplier<T>** — `T get()`, used for lazy creation/factories. They enable lambda-friendly APIs throughout the JDK.",
    proTip: "Also know `BiFunction`, `UnaryOperator`, and primitive specializations like `IntPredicate` to avoid autoboxing in hot loops.",
    codeSnippet: `Predicate<User> isAdult = u -> u.getAge() >= 18;
Function<User,String> name = User::getName;
Consumer<String> log = System.out::println;
Supplier<UUID> id = UUID::randomUUID;`,
    tags: ["functional", "lambda"] }),

  Q({ id: next(), topic: "core-java", topicLabel: "Core Java 8/11", subtopic: "Optional", difficulty: "easy",
    question: "Why use Optional and what are common anti-patterns?",
    answer: "`Optional<T>` documents that a value may be absent and forces the caller to handle it, replacing many `null` checks. Use `map`, `filter`, `orElse`, `orElseThrow`. Anti-patterns: using Optional for fields or method parameters, calling `get()` without `isPresent()`, and wrapping collections (return empty collections instead).",
    proTip: "`orElse(x)` always evaluates `x`; use `orElseGet(() -> x)` for expensive defaults to keep them lazy.",
    codeSnippet: `String email = userRepo.findById(id)
    .map(User::getEmail)
    .orElseThrow(() -> new NotFoundException("User"));`,
    tags: ["optional", "java8"] }),

  Q({ id: next(), topic: "core-java", topicLabel: "Core Java 8/11", subtopic: "Equality", difficulty: "easy",
    question: "What is the difference between == and .equals(), and what is the hashCode contract?",
    answer: "`==` compares references for objects (and values for primitives). `.equals()` compares logical equality (overridden in `String`, wrappers, etc.). **Contract:** if `a.equals(b)` then `a.hashCode() == b.hashCode()`. Violating it breaks `HashMap`/`HashSet` lookups. Always override both together.",
    proTip: "Always include the same fields in `equals` and `hashCode`. Use `Objects.equals` and `Objects.hash` to avoid NPEs.",
    codeSnippet: `@Override public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof User u)) return false;
    return Objects.equals(id, u.id);
}
@Override public int hashCode() { return Objects.hash(id); }`,
    tags: ["equals", "hashcode"] }),

  Q({ id: next(), topic: "core-java", topicLabel: "Core Java 8/11", subtopic: "Strings", difficulty: "medium",
    question: "Explain the String pool and why String is immutable.",
    answer: "String literals are interned in the **String pool** (a region of the heap) so identical literals share one object. Immutability gives: thread-safety without locks, safe use as `HashMap` keys (hash cached), security (e.g. file paths/credentials can't change after validation), and pool-based memory savings. `new String(\"x\")` bypasses the pool; use `intern()` to add it.",
    proTip: "Prefer `StringBuilder` in loops — concatenation with `+` creates a new String each iteration (O(n²) total).",
    tags: ["string", "immutability"] }),

  Q({ id: next(), topic: "core-java", topicLabel: "Core Java 8/11", subtopic: "JVM Memory", difficulty: "medium",
    question: "Explain the Java Memory Model: stack vs heap, and how G1 GC works.",
    answer: "**Stack** — per-thread, holds frames/locals/refs, fast LIFO. **Heap** — shared, holds objects, GC-managed. Heap is split into Young (Eden + S0/S1) and Old generations. **G1 GC** divides the heap into equal-size regions, collects regions with the most garbage first ('garbage first'), runs mostly concurrently, and aims to meet a soft pause-time goal. It replaced CMS and is the default since Java 9.",
    proTip: "Mention escape analysis: the JIT may stack-allocate objects that don't escape a method, reducing GC pressure.",
    tags: ["jvm", "gc", "memory"] }),

  Q({ id: next(), topic: "core-java", topicLabel: "Core Java 8/11", subtopic: "Exceptions", difficulty: "easy",
    question: "Checked vs unchecked exceptions, and what is try-with-resources?",
    answer: "**Checked** (extend `Exception`) must be caught or declared — for recoverable conditions (IOException). **Unchecked** (extend `RuntimeException`) signal programming errors (NPE, IllegalArgument). **try-with-resources** auto-closes any resource implementing `AutoCloseable`, in reverse declaration order, even on exception — preventing resource leaks.",
    proTip: "Custom exceptions: extend `RuntimeException` for service-layer errors so callers aren't forced into ugly try/catch chains.",
    codeSnippet: `try (var conn = ds.getConnection();
     var ps = conn.prepareStatement(sql)) {
    return ps.executeQuery();
} // auto-closed`,
    tags: ["exceptions"] }),

  Q({ id: next(), topic: "core-java", topicLabel: "Core Java 8/11", subtopic: "Concurrency", difficulty: "hard",
    question: "Difference between synchronized and volatile, and when to use each?",
    answer: "`synchronized` provides **mutual exclusion** AND **visibility** — only one thread enters the block, and changes are flushed to main memory. `volatile` provides **only visibility** and ordering (happens-before) — reads/writes go to main memory, but compound actions (`x++`) are still not atomic. Use `volatile` for single-writer flags or DCL singletons; use `synchronized`/`Lock`/atomics for compound actions.",
    proTip: "Prefer `java.util.concurrent.atomic` (`AtomicInteger`, `AtomicReference`) over manual synchronization for counters and refs.",
    codeSnippet: `private volatile boolean running = true;
public void stop() { running = false; }   // safe publish
public void loop() { while (running) doWork(); }`,
    tags: ["concurrency", "volatile"] }),

  Q({ id: next(), topic: "core-java", topicLabel: "Core Java 8/11", subtopic: "Concurrency", difficulty: "medium",
    question: "ExecutorService vs CompletableFuture — when to use which?",
    answer: "`ExecutorService` is a thread-pool abstraction: submit `Runnable`/`Callable`, get `Future`. `CompletableFuture` is built on top — it's a *composable* async pipeline supporting `thenApply`, `thenCompose`, `thenCombine`, `exceptionally`, and async chaining. Use `ExecutorService` for fire-and-forget work; use `CompletableFuture` for non-blocking pipelines (parallel API calls, fan-out/fan-in).",
    proTip: "Always pass an explicit `Executor` to `CompletableFuture.supplyAsync` — the default `ForkJoinPool.commonPool` can starve under blocking I/O.",
    codeSnippet: `CompletableFuture<User> u = CompletableFuture.supplyAsync(() -> userApi.fetch(id), exec);
CompletableFuture<Score> s = CompletableFuture.supplyAsync(() -> scoreApi.fetch(id), exec);
u.thenCombine(s, Profile::new).thenAccept(this::send);`,
    tags: ["concurrency", "completablefuture"], resumeLink: "Concurrent banking calls at KUWY" }),

  Q({ id: next(), topic: "core-java", topicLabel: "Core Java 8/11", subtopic: "Java 8", difficulty: "easy",
    question: "What are method references and default methods?",
    answer: "**Method references** (`ClassName::method`) are shorthand for lambdas calling a single method — four kinds: static, bound instance, unbound instance, and constructor. **Default methods** let interfaces provide a method body, enabling backward-compatible API evolution (e.g. `Collection.stream()`).",
    proTip: "Diamond conflict: if two interfaces define the same default method, the implementing class must override it explicitly.",
    codeSnippet: `users.forEach(System.out::println);
Function<String,Integer> len = String::length;
Supplier<List<String>> mk = ArrayList::new;`,
    tags: ["java8", "lambda"] }),

  Q({ id: next(), topic: "core-java", topicLabel: "Core Java 8/11", subtopic: "Java 11", difficulty: "easy",
    question: "Notable features added between Java 8 and Java 11?",
    answer: "Java 9: modules (JPMS), `var`-less factory methods (`List.of`). Java 10: `var` local-variable type inference. Java 11: HTTP Client API (`java.net.http`), `String.isBlank/lines/repeat/strip`, `Files.readString/writeString`, running single-file source (`java App.java`), and removal of Java EE modules.",
    proTip: "Java 11 is the LTS most enterprise teams (including KUWY-style stacks) standardize on after Java 8.",
    tags: ["java11"] }),

  // ============ SPRING (10) ============
  Q({ id: next(), topic: "spring", topicLabel: "Spring Boot & Spring Core", subtopic: "Auto-Config", difficulty: "easy",
    question: "How does Spring Boot auto-configuration work?",
    answer: "Spring Boot scans the classpath and applies `@Configuration` classes from `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (formerly `spring.factories`). Each config is conditional via `@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnProperty` — so beans are only created when needed. Starters (`spring-boot-starter-web`) bundle dependencies that trigger the right auto-configs.",
    proTip: "Use `--debug` flag or `/actuator/conditions` to see which auto-configs matched and why others didn't.",
    tags: ["spring-boot", "autoconfig"] }),

  Q({ id: next(), topic: "spring", topicLabel: "Spring Boot & Spring Core", subtopic: "DI", difficulty: "medium",
    question: "Constructor vs Field vs Setter injection — which is best and why?",
    answer: "**Constructor injection** is preferred: dependencies are immutable (`final`), the bean is fully initialized after construction, easy to unit-test (no Spring needed), and circular dependencies fail fast. **Field injection** (`@Autowired` on fields) is concise but hides dependencies and breaks testability. **Setter injection** is useful for optional dependencies.",
    proTip: "With Spring 4.3+, a single constructor implicitly autowires — no `@Autowired` needed. Lombok's `@RequiredArgsConstructor` makes this elegant.",
    codeSnippet: `@Service
@RequiredArgsConstructor
public class LoanService {
    private final LoanRepository repo;
    private final CreditClient credit;
}`,
    tags: ["di", "spring"] }),

  Q({ id: next(), topic: "spring", topicLabel: "Spring Boot & Spring Core", subtopic: "Bean Lifecycle", difficulty: "medium",
    question: "Explain Spring bean lifecycle and bean scopes.",
    answer: "**Lifecycle:** instantiate → populate properties → `BeanNameAware/BeanFactoryAware` → `BeanPostProcessor.before` → `@PostConstruct` / `InitializingBean.afterPropertiesSet` → custom init → `BeanPostProcessor.after` → in use → `@PreDestroy` / `DisposableBean.destroy`. **Scopes:** `singleton` (default, one per container), `prototype` (new each request), `request`, `session`, `application`, `websocket`.",
    proTip: "Injecting a prototype bean into a singleton freezes one instance — use `ObjectProvider<T>` or `@Lookup` to get a fresh one each call.",
    tags: ["spring", "lifecycle"] }),

  Q({ id: next(), topic: "spring", topicLabel: "Spring Boot & Spring Core", subtopic: "REST", difficulty: "easy",
    question: "Difference between @RestController/@Controller and @RequestMapping/@GetMapping?",
    answer: "`@Controller` returns view names (resolved by ViewResolver). `@RestController` = `@Controller` + `@ResponseBody`, so return values are serialized to JSON via Jackson. `@RequestMapping` is generic (any method); `@GetMapping`/`@PostMapping`/etc. are HTTP-method-specific shortcuts — clearer and safer.",
    proTip: "Use `ResponseEntity<T>` when you need to control status code or headers (e.g. 201 + Location for POST).",
    codeSnippet: `@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
public class LoanController {
    private final LoanService svc;
    @GetMapping("/{id}")
    public LoanDto get(@PathVariable Long id) { return svc.get(id); }
}`,
    tags: ["rest", "spring"], resumeLink: "20+ REST APIs at KUWY" }),

  Q({ id: next(), topic: "spring", topicLabel: "Spring Boot & Spring Core", subtopic: "Profiles", difficulty: "easy",
    question: "How do Spring Profiles and externalized configuration work?",
    answer: "Profiles activate environment-specific beans/config. Set with `spring.profiles.active=dev` (env var, JVM arg, `application.yml`). Use `application-dev.yml`, `application-prod.yml`. Annotate beans with `@Profile(\"prod\")`. Property precedence (high→low): command-line args, OS env, `application-{profile}.yml`, `application.yml`, `@PropertySource`.",
    proTip: "Never commit secrets to YAML — use env vars, AWS Secrets Manager, or Spring Cloud Config in production.",
    tags: ["spring", "profiles"] }),

  Q({ id: next(), topic: "spring", topicLabel: "Spring Boot & Spring Core", subtopic: "AOP", difficulty: "hard",
    question: "Explain Spring AOP — what are @Aspect, @Before, @After, @Around used for?",
    answer: "AOP modularizes cross-cutting concerns (logging, metrics, security, transactions) without polluting business code. Spring AOP is **proxy-based** (JDK dynamic proxy for interfaces, CGLIB for classes). `@Before` runs before the join point; `@After` always runs; `@AfterReturning`/`@AfterThrowing` run conditionally; `@Around` wraps the call (must invoke `pjp.proceed()`). `@Transactional` and `@Cacheable` are AOP-driven.",
    proTip: "Self-invocation bypasses the proxy — calling `this.cachedMethod()` from another method in the same class skips `@Cacheable`.",
    codeSnippet: `@Aspect @Component
public class TimingAspect {
  @Around("@annotation(Timed)")
  public Object time(ProceedingJoinPoint pjp) throws Throwable {
    long t = System.nanoTime();
    try { return pjp.proceed(); }
    finally { log.info("{} took {} ns", pjp.getSignature(), System.nanoTime()-t); }
  }
}`,
    tags: ["aop", "spring"] }),

  Q({ id: next(), topic: "spring", topicLabel: "Spring Boot & Spring Core", subtopic: "Exception Handling", difficulty: "medium",
    question: "How do you handle exceptions globally with @ControllerAdvice?",
    answer: "`@ControllerAdvice` (or `@RestControllerAdvice`) is a global interceptor for `@ExceptionHandler` methods. Map domain exceptions (e.g. `LoanNotFoundException`) to HTTP statuses + a consistent error body. Combine with `@Valid` + `MethodArgumentNotValidException` handler for validation errors.",
    proTip: "Return RFC 7807 `ProblemDetail` (Spring 6) for a standard error format consumable by frontends and API clients.",
    codeSnippet: `@RestControllerAdvice
public class ApiExceptionHandler {
  @ExceptionHandler(LoanNotFoundException.class)
  public ResponseEntity<ApiError> notFound(LoanNotFoundException ex) {
    return ResponseEntity.status(404).body(new ApiError("LOAN_NOT_FOUND", ex.getMessage()));
  }
}`,
    tags: ["spring", "exceptions"], resumeLink: "Banking API error handling at KUWY" }),

  Q({ id: next(), topic: "spring", topicLabel: "Spring Boot & Spring Core", subtopic: "Spring Data", difficulty: "medium",
    question: "What does @Transactional do and what are propagation levels?",
    answer: "`@Transactional` opens a transaction before the method, commits on success, rolls back on `RuntimeException` (configurable via `rollbackFor`). Propagation: **REQUIRED** (default — join existing or start new), **REQUIRES_NEW** (suspend current, start new — useful for audit logs that must persist even if outer fails), **NESTED**, **SUPPORTS**, **MANDATORY**, **NEVER**. Isolation maps to DB levels (READ_COMMITTED, REPEATABLE_READ, etc.).",
    proTip: "`@Transactional` only works through the proxy — calling a `@Transactional` method from the same class won't open a transaction.",
    tags: ["transactional", "spring"] }),

  Q({ id: next(), topic: "spring", topicLabel: "Spring Boot & Spring Core", subtopic: "Project", difficulty: "hard",
    question: "How did you structure your Banking Loan APIs at KUWY?",
    answer: "Layered architecture: **Controller → Service → Repository → Entity**, with DTOs at the boundary. Each loan product (auto, personal) was a microservice with its own MySQL schema. Cross-cutting concerns: `@ControllerAdvice` for errors, `@Aspect` for audit logging, Resilience4j Circuit Breakers around third-party calls (Aadhar/PAN/RC verification), Redis cache-aside for KYC lookups (30% latency drop), JWT-based auth via Spring Security, Swagger for docs, and Flyway for schema migrations. Deployed on AWS EC2 behind ALB with Auto Scaling.",
    proTip: "When asked 'how do you keep services consistent?' mention saga / outbox pattern for distributed transactions instead of 2PC.",
    tags: ["project", "architecture"], resumeLink: "Banking Loan APIs @ KUWY" }),

  Q({ id: next(), topic: "spring", topicLabel: "Spring Boot & Spring Core", subtopic: "Validation", difficulty: "easy",
    question: "How do you validate request bodies in Spring Boot?",
    answer: "Add `spring-boot-starter-validation`, annotate the DTO (`@NotNull`, `@Size`, `@Pattern`, `@Email`), then `@Valid` on the controller parameter. Spring throws `MethodArgumentNotValidException`, which a `@RestControllerAdvice` converts to a 400 with field errors.",
    proTip: "For complex cross-field rules, write a custom `ConstraintValidator` rather than scattering checks in the service.",
    codeSnippet: `public record LoanRequest(
    @NotBlank String pan,
    @Min(10000) @Max(5_000_000) Long amount,
    @Pattern(regexp="\\\\d{12}") String aadhar) {}`,
    tags: ["validation", "spring"] }),

  // ============ MICROSERVICES (8) ============
  Q({ id: next(), topic: "microservices", topicLabel: "Microservices Architecture", subtopic: "Fundamentals", difficulty: "easy",
    question: "Monolith vs Microservices — when to choose which?",
    answer: "**Monolith** wins for small teams, simple domains, fast iteration: one deploy, one DB, no network hops. **Microservices** win when teams scale, the domain has clear bounded contexts, you need independent deploys/scaling, and polyglot tech. Costs: distributed-system complexity (latency, partial failures, eventual consistency, observability). Start monolith → extract services as pain emerges.",
    proTip: "Cite Conway's Law: your service boundaries will mirror your team boundaries — design accordingly.",
    tags: ["microservices"] }),

  Q({ id: next(), topic: "microservices", topicLabel: "Microservices Architecture", subtopic: "Infra", difficulty: "medium",
    question: "Explain Service Discovery, API Gateway, and Load Balancing.",
    answer: "**Service Discovery** (Eureka, Consul) lets services find each other dynamically as instances scale up/down. **API Gateway** (Spring Cloud Gateway, Kong) is the single entry point: routing, auth, rate limiting, request transformation, response aggregation. **Load Balancing** distributes requests — client-side (Ribbon/Spring Cloud LoadBalancer) picks an instance from the registry; server-side (ALB, Nginx) sits in front of pools.",
    proTip: "On AWS we used ALB (server-side) + ECS service discovery — simpler than running Eureka.",
    tags: ["discovery", "gateway"], resumeLink: "ALB + Auto Scaling at KUWY" }),

  Q({ id: next(), topic: "microservices", topicLabel: "Microservices Architecture", subtopic: "Communication", difficulty: "medium",
    question: "REST vs messaging (Kafka/RabbitMQ) for inter-service communication?",
    answer: "**REST/sync** — simple, request/response, immediate result; couples caller availability to callee. **Messaging/async** — decouples producers/consumers, buffers spikes, enables event-driven flows (order placed → inventory + email + analytics consume). **Kafka** is a distributed log (high-throughput, replayable). **RabbitMQ** is a smart broker (routing, priorities). Use sync for queries; async for state-change events.",
    proTip: "For 'how do you avoid losing events?' mention the **transactional outbox** pattern — persist event in same DB tx as state change, then publish.",
    tags: ["kafka", "messaging"] }),

  Q({ id: next(), topic: "microservices", topicLabel: "Microservices Architecture", subtopic: "Resilience", difficulty: "hard",
    question: "Explain the Circuit Breaker pattern (Resilience4j).",
    answer: "Wraps a remote call in a state machine: **CLOSED** (calls pass through, failures counted) → **OPEN** (after threshold, fail fast for `waitDurationInOpenState`) → **HALF_OPEN** (try a few probes; success → CLOSED, failure → OPEN). Prevents cascading failures and gives the downstream time to recover. Pair with timeouts, retries (with jitter), and bulkheads.",
    proTip: "Always provide a `fallback` (cached data, default, partial response) — circuit breaker without fallback just turns 5xx into faster 5xx.",
    codeSnippet: `@CircuitBreaker(name="aadhar", fallbackMethod="cachedAadhar")
public Verification verify(String pan) {
    return aadharClient.verify(pan);
}
public Verification cachedAadhar(String pan, Throwable t) {
    return cache.get(pan); // graceful degradation
}`,
    tags: ["resilience4j", "circuit-breaker"], resumeLink: "Reliability for Aadhar/PAN at KUWY" }),

  Q({ id: next(), topic: "microservices", topicLabel: "Microservices Architecture", subtopic: "Caching", difficulty: "medium",
    question: "Caching strategies — how did you improve performance by 30%?",
    answer: "Strategies: **Cache-aside** (app reads cache, on miss reads DB and populates), **Read-through** (cache loads from DB), **Write-through** (writes go through cache to DB), **Write-behind** (async). At KUWY we used Redis cache-aside for hot KYC and loan-product lookups + Caffeine in-process L1 for ultra-hot keys, with TTL + event-driven invalidation on updates. Hot endpoints dropped from ~250ms to ~170ms (30%+).",
    proTip: "Watch for **cache stampede** — use locking or `request coalescing`, and add jitter to TTLs to prevent synchronized expiry.",
    tags: ["redis", "cache"], resumeLink: "30% perf improvement at KUWY" }),

  Q({ id: next(), topic: "microservices", topicLabel: "Microservices Architecture", subtopic: "Observability", difficulty: "medium",
    question: "Distributed tracing and centralized logging — how would you set them up?",
    answer: "**Tracing**: Spring Cloud Sleuth / Micrometer Tracing propagate `traceId`/`spanId` across HTTP/Kafka via headers (W3C Trace Context); export to Zipkin/Jaeger. **Logging**: structured JSON logs (Logback + Logstash encoder) shipped via Filebeat to ELK/CloudWatch with `traceId` for correlation. **Metrics**: Micrometer → Prometheus → Grafana dashboards + alerts.",
    proTip: "Always log the `traceId` — it lets you reconstruct a single user request across 5+ services in seconds.",
    tags: ["observability", "tracing"] }),

  Q({ id: next(), topic: "microservices", topicLabel: "Microservices Architecture", subtopic: "Data", difficulty: "medium",
    question: "Why 'database per service'? How do you query across services?",
    answer: "Each service owns its schema → loose coupling, independent scaling, polyglot persistence. To query across services: **API composition** (gateway/aggregator calls each service), **CQRS + materialized read model** (services emit events; a read service builds a denormalized view), or **data replication** via change data capture (Debezium → Kafka). Avoid sharing a DB — it recreates the monolith with extra latency.",
    proTip: "Joining via API composition is fine for 2-3 services; beyond that, build a read model.",
    tags: ["microservices", "data"] }),

  Q({ id: next(), topic: "microservices", topicLabel: "Microservices Architecture", subtopic: "Project", difficulty: "hard",
    question: "How did you split your banking services into microservices?",
    answer: "Split by **bounded context**: Customer/KYC, Loan Origination, Underwriting, Disbursement, Repayment, Notifications. Each owns its DB schema. Sync REST for query flows (loan status), async Kafka events for state changes (LoanApproved → Disbursement + Notification consume). API Gateway centralized JWT validation and rate limiting. Resilience4j + Redis cache around third-party (Aadhar/PAN/Vehicle RC). Deployed on AWS ECS behind ALB with Auto Scaling.",
    proTip: "Be ready for 'how would you handle a failed disbursement?' — outbox + saga compensations (reverse the loan approval, notify ops).",
    tags: ["project", "microservices"], resumeLink: "Microservices @ KUWY" }),

  // ============ REST API (8) ============
  Q({ id: next(), topic: "rest-api", topicLabel: "REST API Design", subtopic: "Principles", difficulty: "easy",
    question: "What are REST principles and the right HTTP method/status codes?",
    answer: "REST = stateless, cacheable, uniform interface, resource-oriented. **Methods:** GET (read, safe+idempotent), POST (create, not idempotent), PUT (full replace, idempotent), PATCH (partial update), DELETE (idempotent). **Statuses:** 200 OK, 201 Created (+Location), 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable, 429 Too Many Requests, 500 Server Error, 503 Unavailable.",
    proTip: "Don't return 200 with `{\"error\":...}` — use proper status codes; clients and middleware depend on them.",
    tags: ["rest", "http"] }),

  Q({ id: next(), topic: "rest-api", topicLabel: "REST API Design", subtopic: "Versioning", difficulty: "medium",
    question: "What are the API versioning strategies and trade-offs?",
    answer: "**URI versioning** (`/api/v1/loans`) — simple, cache-friendly, most popular. **Header versioning** (`Accept: application/vnd.bank.v2+json`) — keeps URIs clean, true content negotiation, but harder to test in browsers. **Query param** (`?v=2`) — easy but mixes config with data. Pick one and stay consistent. Bump major versions only on breaking changes; add fields backward-compatibly.",
    proTip: "Maintain N and N-1 in production. Deprecate with `Sunset`/`Deprecation` headers and clear timelines.",
    tags: ["rest", "versioning"] }),

  Q({ id: next(), topic: "rest-api", topicLabel: "REST API Design", subtopic: "Pagination", difficulty: "medium",
    question: "Pagination, filtering, and sorting in REST APIs?",
    answer: "**Offset pagination** (`?page=2&size=20`) — easy but slow on large offsets and unstable when data changes. **Cursor/keyset** (`?after=<id>&size=20`) — stable, fast, but no jumping to page N. Filtering: `?status=APPROVED&minAmount=10000`. Sorting: `?sort=createdAt,desc`. Always cap `size` server-side.",
    proTip: "Spring Data's `Pageable` parameter handles offset pagination automatically and returns `Page<T>` with totals.",
    codeSnippet: `@GetMapping
public Page<LoanDto> list(@RequestParam(required=false) Status status,
                          Pageable pageable) {
    return svc.search(status, pageable);
}`,
    tags: ["rest", "pagination"] }),

  Q({ id: next(), topic: "rest-api", topicLabel: "REST API Design", subtopic: "Reliability", difficulty: "hard",
    question: "Explain HATEOAS, idempotency, and rate limiting.",
    answer: "**HATEOAS** — responses include links to next actions (`{\"_links\":{\"approve\":\"/loans/1/approve\"}}`); enables discoverability. **Idempotency** — repeating the call has the same effect; use an `Idempotency-Key` header for POSTs (payments) and store the key+result so retries are safe. **Rate limiting** — token bucket / leaky bucket per API key/IP; respond 429 with `Retry-After`. Implement at gateway (Bucket4j, Kong, ALB+WAF).",
    proTip: "For payments: combine idempotency keys with DB unique constraint on the key — guarantees 'process once' even under retries.",
    tags: ["rest", "idempotency", "rate-limit"] }),

  Q({ id: next(), topic: "rest-api", topicLabel: "REST API Design", subtopic: "Validation", difficulty: "easy",
    question: "How do you validate API requests with @Valid?",
    answer: "Add Jakarta validation annotations (`@NotNull`, `@Size`, `@Pattern`, `@Email`, `@Min/@Max`) on the DTO. Annotate controller param with `@Valid`. On violation, Spring throws `MethodArgumentNotValidException` — handle in `@RestControllerAdvice` to return 400 with a field-level error array.",
    proTip: "Use validation **groups** (e.g. `Create.class`, `Update.class`) when the same DTO is reused with different rules.",
    tags: ["rest", "validation"] }),

  Q({ id: next(), topic: "rest-api", topicLabel: "REST API Design", subtopic: "Docs", difficulty: "easy",
    question: "How do you document APIs with Swagger/OpenAPI?",
    answer: "Add `springdoc-openapi-starter-webmvc-ui`. It auto-generates an OpenAPI 3 spec at `/v3/api-docs` and a Swagger UI at `/swagger-ui.html`. Enrich with `@Operation`, `@Schema`, `@ApiResponse`. Export the JSON to generate client SDKs (openapi-generator) for frontend/mobile teams.",
    proTip: "Lock down Swagger UI in production — disable it via profiles or protect with auth; never expose API surface to the world.",
    tags: ["swagger", "openapi"] }),

  Q({ id: next(), topic: "rest-api", topicLabel: "REST API Design", subtopic: "Project", difficulty: "hard",
    question: "How did you design 20+ scalable REST APIs at KUWY?",
    answer: "Standardized: URI versioning (`/api/v1/...`), DTOs (never expose entities), Bean Validation on inputs, `@RestControllerAdvice` for uniform errors, pagination via `Pageable`, OpenAPI docs, JWT auth, rate limiting at gateway, request/response logging with `traceId`, and Resilience4j around outbound calls. Performance: connection pooling (HikariCP), Redis caching on hot reads, async non-blocking calls with `CompletableFuture` for fan-out (Aadhar + PAN + RC in parallel).",
    proTip: "Mention an SLA mindset — you measured p95/p99 latency per endpoint and alerted in Grafana, not just averages.",
    tags: ["rest", "project"], resumeLink: "20+ APIs @ KUWY" }),

  Q({ id: next(), topic: "rest-api", topicLabel: "REST API Design", subtopic: "Integration", difficulty: "medium",
    question: "How did you integrate third-party APIs (Aadhar, PAN, Vehicle RC)?",
    answer: "Wrapped each in a thin client (`AadharClient`, `PanClient`) using Spring's `RestClient`/Feign with: timeouts, retries with exponential backoff + jitter, Resilience4j circuit breaker, Redis cache for repeat lookups, structured logging, and a typed exception hierarchy. Calls were parallelized via `CompletableFuture.allOf`. On breaker-open, returned cached/last-known-good data and queued an async re-verification.",
    proTip: "Always set explicit connect + read timeouts. Default infinite timeouts will hang threads and crash the service under provider slowness.",
    tags: ["integration", "resilience4j"], resumeLink: "Aadhar/PAN/RC at KUWY" }),

  // ============ HIBERNATE/JPA (6) ============
  Q({ id: next(), topic: "hibernate-jpa", topicLabel: "Hibernate / JPA", subtopic: "Mappings", difficulty: "easy",
    question: "Explain @OneToMany, @ManyToOne, @ManyToMany with examples.",
    answer: "**@ManyToOne** is the *owning* side (holds the FK) — most common. **@OneToMany** is the inverse side, declared with `mappedBy`. **@ManyToMany** uses a join table — usually replaced by an explicit join entity to add columns (e.g. `LoanCustomer` with role/timestamps).",
    proTip: "Always make collections lazy (default for `@OneToMany`/`@ManyToMany`) and reach for them inside an open session/transaction.",
    codeSnippet: `@Entity class Loan {
  @ManyToOne(fetch = LAZY) Customer customer;
}
@Entity class Customer {
  @OneToMany(mappedBy = "customer") List<Loan> loans;
}`,
    tags: ["jpa", "mappings"] }),

  Q({ id: next(), topic: "hibernate-jpa", topicLabel: "Hibernate / JPA", subtopic: "Performance", difficulty: "hard",
    question: "What is the N+1 problem and how do you fix it?",
    answer: "Loading N parents triggers N additional queries to load each parent's lazy children — total N+1 queries. Fixes: **JOIN FETCH** in JPQL, **`@EntityGraph`** on repository methods, **batch fetching** (`@BatchSize`), or DTO projections that fetch only needed fields in one query.",
    proTip: "Enable `spring.jpa.show-sql=true` + `org.hibernate.SQL=DEBUG` in dev — N+1 is invisible until you watch the SQL log.",
    codeSnippet: `@Query("select l from Loan l join fetch l.customer where l.status=:s")
List<Loan> findActiveWithCustomer(@Param("s") Status s);`,
    tags: ["jpa", "n+1"] }),

  Q({ id: next(), topic: "hibernate-jpa", topicLabel: "Hibernate / JPA", subtopic: "Queries", difficulty: "medium",
    question: "JPQL vs Native queries vs Criteria API — when to use each?",
    answer: "**JPQL** — entity-oriented, portable across DBs; default choice. **Native SQL** — when you need DB-specific features (window functions, CTEs, JSONB ops). **Criteria API** — type-safe, dynamic queries built programmatically; verbose. Modern alternative: **QueryDSL** or **Spring Data Specifications** for dynamic filters.",
    proTip: "For dynamic search filters (status + amount range + date), Specifications/QueryDSL beat string concatenation any day.",
    tags: ["jpql", "criteria"] }),

  Q({ id: next(), topic: "hibernate-jpa", topicLabel: "Hibernate / JPA", subtopic: "Transactions", difficulty: "medium",
    question: "Explain @Transactional propagation levels.",
    answer: "**REQUIRED** (default) — join existing or start new. **REQUIRES_NEW** — suspend current, start new (audit logs that must commit even if outer fails). **NESTED** — savepoint within outer tx. **SUPPORTS** — use if exists, else non-tx. **MANDATORY** — must exist, else exception. **NEVER** — must NOT exist. Isolation: READ_COMMITTED (default in most DBs), REPEATABLE_READ, SERIALIZABLE.",
    proTip: "Self-invocation pitfall: calling a `@Transactional` method on `this` skips the proxy and the transaction.",
    tags: ["transactional", "jpa"] }),

  Q({ id: next(), topic: "hibernate-jpa", topicLabel: "Hibernate / JPA", subtopic: "Caching", difficulty: "medium",
    question: "First-level vs Second-level cache in Hibernate?",
    answer: "**L1 cache** = persistence context (`EntityManager`/`Session`) — per-transaction, automatic, dedupes entity loads within a single tx. **L2 cache** = shared across sessions (Ehcache, Caffeine, Hazelcast) — must be enabled (`hibernate.cache.use_second_level_cache=true`) and entities annotated `@Cacheable`. Adds the **Query cache** for query-result caching.",
    proTip: "L2 cache pays off for read-mostly reference data (countries, product types). For read/write hot tables it can hurt due to invalidation cost.",
    tags: ["hibernate", "cache"] }),

  Q({ id: next(), topic: "hibernate-jpa", topicLabel: "Hibernate / JPA", subtopic: "Project", difficulty: "medium",
    question: "How did you handle data persistence for banking loan data?",
    answer: "Spring Data JPA repositories over MySQL with HikariCP pooling. Entities for Customer, Loan, LoanProduct, Document, AuditLog — strict use of DTOs at controller boundary. JOIN FETCH / `@EntityGraph` to avoid N+1 on listing screens. Flyway for versioned migrations. `@Transactional` at the service layer with REQUIRES_NEW for audit writes. Optimistic locking (`@Version`) on Loan to prevent concurrent updates from underwriters.",
    proTip: "For BFSI: keep an immutable audit table written via REQUIRES_NEW + DB triggers as a backstop — required for compliance.",
    tags: ["jpa", "project"], resumeLink: "Loan persistence @ KUWY" }),

  // ============ DSA (15) ============
  Q({ id: next(), topic: "dsa", topicLabel: "Data Structures & Algorithms", subtopic: "Arrays", difficulty: "easy",
    question: "Explain the two-pointer technique with an example.",
    answer: "Two indices move through an array (same or opposite ends) to reduce O(n²) brute force to O(n). Common uses: pair sum in sorted array, removing duplicates in-place, container with most water, 3-sum.",
    proTip: "Two pointers usually require the input to be **sorted** or have some monotonic property — state that requirement first.",
    codeSnippet: `int[] twoSumSorted(int[] a, int target) {
    int l = 0, r = a.length - 1;
    while (l < r) {
        int s = a[l] + a[r];
        if (s == target) return new int[]{l, r};
        if (s < target) l++; else r--;
    }
    return new int[0];
}`,
    tags: ["arrays", "two-pointer"] }),

  Q({ id: next(), topic: "dsa", topicLabel: "Data Structures & Algorithms", subtopic: "Arrays", difficulty: "medium",
    question: "Sliding window — explain with longest substring without repeating chars.",
    answer: "Maintain a window `[l, r]` and slide `r`; shrink from `l` when constraint breaks. Use a HashMap/Set to track window contents. O(n) time, O(k) space where k is alphabet/distinct count.",
    proTip: "Decide fixed vs variable window first. Fixed windows (size k) usually use a deque; variable windows use l/r + map.",
    codeSnippet: `int lengthOfLongestSubstring(String s) {
    Map<Character,Integer> last = new HashMap<>();
    int l = 0, best = 0;
    for (int r = 0; r < s.length(); r++) {
        char c = s.charAt(r);
        if (last.containsKey(c) && last.get(c) >= l) l = last.get(c) + 1;
        last.put(c, r);
        best = Math.max(best, r - l + 1);
    }
    return best;
}`,
    tags: ["sliding-window"] }),

  Q({ id: next(), topic: "dsa", topicLabel: "Data Structures & Algorithms", subtopic: "Arrays", difficulty: "medium",
    question: "Explain Kadane's algorithm for max subarray sum.",
    answer: "At each index, decide: extend the current subarray or start fresh. `cur = max(a[i], cur + a[i])`; `best = max(best, cur)`. O(n) time, O(1) space. Handles all-negative arrays correctly when `best` is initialized to `a[0]`.",
    proTip: "Follow-up: also return the indices — track start when you 'start fresh' and end when you update `best`.",
    codeSnippet: `int maxSubArray(int[] a) {
    int cur = a[0], best = a[0];
    for (int i = 1; i < a.length; i++) {
        cur = Math.max(a[i], cur + a[i]);
        best = Math.max(best, cur);
    }
    return best;
}`,
    tags: ["dp", "kadane"] }),

  Q({ id: next(), topic: "dsa", topicLabel: "Data Structures & Algorithms", subtopic: "Linked List", difficulty: "easy",
    question: "Reverse a singly linked list (iterative).",
    answer: "Walk the list, flipping each `next` pointer to the previous node. O(n) time, O(1) space.",
    proTip: "Recursive version is elegant but uses O(n) stack. State the trade-off in interviews.",
    codeSnippet: `ListNode reverse(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
        ListNode nxt = cur.next;
        cur.next = prev;
        prev = cur; cur = nxt;
    }
    return prev;
}`,
    tags: ["linked-list"] }),

  Q({ id: next(), topic: "dsa", topicLabel: "Data Structures & Algorithms", subtopic: "Linked List", difficulty: "medium",
    question: "Detect a cycle in a linked list (Floyd's algorithm).",
    answer: "Two pointers: `slow` (1 step) and `fast` (2 steps). If they meet, a cycle exists. To find cycle start: reset one pointer to head and advance both one step until they meet. O(n) time, O(1) space.",
    proTip: "Mention HashSet alternative (O(n) space) — interviewers love hearing both and the trade-off.",
    codeSnippet: `boolean hasCycle(ListNode head) {
    ListNode s = head, f = head;
    while (f != null && f.next != null) {
        s = s.next; f = f.next.next;
        if (s == f) return true;
    }
    return false;
}`,
    tags: ["linked-list", "floyd"] }),

  Q({ id: next(), topic: "dsa", topicLabel: "Data Structures & Algorithms", subtopic: "Stack", difficulty: "easy",
    question: "Valid parentheses — match brackets using a stack.",
    answer: "Push openers; on a closer, pop and check it matches. Empty stack at end = valid. O(n) time, O(n) space.",
    proTip: "Use a `Map<Character,Character>` of close→open to keep the matching code clean.",
    codeSnippet: `boolean isValid(String s) {
    Map<Character,Character> m = Map.of(')','(', ']','[', '}','{');
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (m.containsKey(c)) { if (st.isEmpty() || st.pop() != m.get(c)) return false; }
        else st.push(c);
    }
    return st.isEmpty();
}`,
    tags: ["stack"] }),

  Q({ id: next(), topic: "dsa", topicLabel: "Data Structures & Algorithms", subtopic: "Stack", difficulty: "medium",
    question: "Design a Min Stack with O(1) getMin().",
    answer: "Use two stacks: main + a `min` stack that pushes the new minimum on each push, pops in sync. Alternatively, store `(value, currentMin)` pairs.",
    proTip: "Variant: implement with a single stack by storing the difference `value - min` to save memory.",
    codeSnippet: `class MinStack {
    Deque<Integer> st = new ArrayDeque<>(), mins = new ArrayDeque<>();
    public void push(int x) {
        st.push(x);
        mins.push(mins.isEmpty() ? x : Math.min(x, mins.peek()));
    }
    public void pop() { st.pop(); mins.pop(); }
    public int top() { return st.peek(); }
    public int getMin() { return mins.peek(); }
}`,
    tags: ["stack", "design"] }),

  Q({ id: next(), topic: "dsa", topicLabel: "Data Structures & Algorithms", subtopic: "Trees", difficulty: "medium",
    question: "Explain BST validation and tree traversals.",
    answer: "**Traversals:** Inorder (LNR — sorted for BST), Preorder (NLR), Postorder (LRN), Level-order (BFS via queue). **Validate BST:** recurse passing `(min, max)` bounds, ensuring `min < node.val < max`. Naïve `left.val < node && right.val > node` check is wrong (fails on grandchildren).",
    proTip: "Inorder traversal of a BST yields sorted values — handy for 'kth smallest' problems.",
    codeSnippet: `boolean isBST(TreeNode n, long lo, long hi) {
    if (n == null) return true;
    if (n.val <= lo || n.val >= hi) return false;
    return isBST(n.left, lo, n.val) && isBST(n.right, n.val, hi);
}`,
    tags: ["trees", "bst"] }),

  Q({ id: next(), topic: "dsa", topicLabel: "Data Structures & Algorithms", subtopic: "Trees", difficulty: "hard",
    question: "Lowest Common Ancestor (LCA) in a binary tree.",
    answer: "Recurse: if root is null or matches `p` or `q`, return root. Recurse left and right. If both return non-null, root is LCA. Otherwise return whichever is non-null. O(n) time.",
    proTip: "For BST, use the ordering: walk down — if both p,q < root go left; if both > root go right; else root is LCA. O(h) time.",
    codeSnippet: `TreeNode lca(TreeNode r, TreeNode p, TreeNode q) {
    if (r == null || r == p || r == q) return r;
    TreeNode l = lca(r.left, p, q), R = lca(r.right, p, q);
    return (l != null && R != null) ? r : (l != null ? l : R);
}`,
    tags: ["trees", "lca"] }),

  Q({ id: next(), topic: "dsa", topicLabel: "Data Structures & Algorithms", subtopic: "Graphs", difficulty: "medium",
    question: "BFS vs DFS, and how to detect a cycle in a directed graph.",
    answer: "**BFS** uses a queue, visits by levels — best for shortest path in unweighted graphs. **DFS** uses recursion/stack — best for connectivity, topological sort, cycle detection. **Directed cycle:** DFS with three colors (WHITE/GRAY/BLACK) — back edge to GRAY node = cycle. **Undirected cycle:** DFS tracking parent, or Union-Find.",
    proTip: "For shortest path with weights, use Dijkstra (non-negative) or Bellman-Ford (negatives allowed).",
    tags: ["graphs", "bfs", "dfs"] }),

  Q({ id: next(), topic: "dsa", topicLabel: "Data Structures & Algorithms", subtopic: "Graphs", difficulty: "hard",
    question: "Explain Dijkstra's shortest path algorithm.",
    answer: "Greedy: maintain `dist[]` initialized to ∞ (0 for source) and a min-heap of `(dist, node)`. Pop the smallest, relax its neighbors; push updated entries. O((V+E) log V) with a binary heap. Requires non-negative edge weights.",
    proTip: "Don't decrease-key (Java's PriorityQueue lacks it efficiently) — just push duplicates and skip stale entries on pop.",
    codeSnippet: `int[] dijkstra(int n, List<int[]>[] g, int src) {
    int[] d = new int[n]; Arrays.fill(d, Integer.MAX_VALUE); d[src]=0;
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a->a[0]));
    pq.add(new int[]{0,src});
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        if (cur[0] > d[cur[1]]) continue;
        for (int[] e : g[cur[1]]) {
            int nd = cur[0] + e[1];
            if (nd < d[e[0]]) { d[e[0]] = nd; pq.add(new int[]{nd, e[0]}); }
        }
    }
    return d;
}`,
    tags: ["graphs", "dijkstra"] }),

  Q({ id: next(), topic: "dsa", topicLabel: "Data Structures & Algorithms", subtopic: "Hashing", difficulty: "easy",
    question: "Two Sum — explain the HashMap O(n) approach.",
    answer: "Iterate once, for each `a[i]` check if `target - a[i]` is in the map; if yes, return indices; else put `a[i] → i`. O(n) time, O(n) space.",
    proTip: "If asked to return *all* pairs without duplicates, sort and use two pointers, skipping equal neighbors.",
    codeSnippet: `int[] twoSum(int[] a, int target) {
    Map<Integer,Integer> seen = new HashMap<>();
    for (int i = 0; i < a.length; i++) {
        Integer j = seen.get(target - a[i]);
        if (j != null) return new int[]{j, i};
        seen.put(a[i], i);
    }
    return new int[0];
}`,
    tags: ["hashing", "two-sum"] }),

  Q({ id: next(), topic: "dsa", topicLabel: "Data Structures & Algorithms", subtopic: "Heaps", difficulty: "medium",
    question: "Find the Kth largest element in an array.",
    answer: "Use a **min-heap of size k**: push, then poll when size exceeds k. End: heap top is the k-th largest. O(n log k) time, O(k) space. Alternative: Quickselect — average O(n), worst O(n²).",
    proTip: "If k is close to n, use a max-heap of size n-k+1 instead — symmetry trick.",
    codeSnippet: `int kthLargest(int[] a, int k) {
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    for (int x : a) {
        pq.offer(x);
        if (pq.size() > k) pq.poll();
    }
    return pq.peek();
}`,
    tags: ["heap", "kth"] }),

  Q({ id: next(), topic: "dsa", topicLabel: "Data Structures & Algorithms", subtopic: "Sorting", difficulty: "medium",
    question: "Compare Quicksort and Mergesort — time complexity and use cases.",
    answer: "**Quicksort:** average O(n log n), worst O(n²) (bad pivot), in-place, NOT stable. Cache-friendly, fast in practice. **Mergesort:** O(n log n) guaranteed, O(n) extra space, stable. Java's `Arrays.sort(int[])` uses Dual-Pivot Quicksort; `Arrays.sort(Object[])` and `Collections.sort` use Timsort (stable, adaptive merge sort).",
    proTip: "Pick mergesort when stability matters (sorting by multiple keys) or for linked lists; quicksort for raw speed on primitive arrays.",
    tags: ["sorting"] }),

  Q({ id: next(), topic: "dsa", topicLabel: "Data Structures & Algorithms", subtopic: "DP", difficulty: "hard",
    question: "Coin change — minimum coins to make amount N.",
    answer: "DP: `dp[i] = min(dp[i - coin] + 1)` over all coins `<= i`, base `dp[0]=0`. O(N * coins) time, O(N) space. Return -1 if `dp[N]` stayed ∞.",
    proTip: "If asked for *number of ways* (not min coins), it's the unbounded knapsack count — iterate coins outer, amount inner.",
    codeSnippet: `int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1); dp[0] = 0;
    for (int i = 1; i <= amount; i++)
        for (int c : coins)
            if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}`,
    tags: ["dp", "coin-change"] }),

  // ============ SQL & DB (10) ============
  Q({ id: next(), topic: "sql-db", topicLabel: "SQL & Databases", subtopic: "Joins", difficulty: "easy",
    question: "Explain INNER, LEFT, RIGHT, FULL JOINs, subqueries, and CTEs.",
    answer: "**INNER** — rows present in both. **LEFT** — all from left + matching right (NULLs otherwise). **RIGHT** — mirror. **FULL** — all from both. **Subquery** — query inside a query (in SELECT, FROM, or WHERE). **CTE** (`WITH x AS (...)`) — named, readable, supports recursion (org charts, tree paths).",
    proTip: "Prefer CTEs over deeply nested subqueries — much easier to read and debug. Many DBs now optimize them just as well.",
    codeSnippet: `WITH active AS (
    SELECT customer_id, COUNT(*) c
    FROM loans WHERE status='APPROVED' GROUP BY customer_id
)
SELECT c.name, a.c FROM customers c
LEFT JOIN active a ON a.customer_id = c.id;`,
    tags: ["sql", "joins"] }),

  Q({ id: next(), topic: "sql-db", topicLabel: "SQL & Databases", subtopic: "Indexing", difficulty: "hard",
    question: "How do B-Tree indexes work, and when should you NOT add an index?",
    answer: "B-Tree (actually B+Tree) keeps sorted keys in a balanced multi-way tree → O(log n) lookup, range scan via leaf links. **Composite index** `(a,b,c)` is usable for filters on `a`, `(a,b)`, `(a,b,c)` — left-prefix rule. **Don't index** when: tables are small, columns have very low cardinality (e.g. boolean), the table is write-heavy and the index is rarely used, or queries do `LIKE '%foo'` (left-wildcard kills B-Tree).",
    proTip: "Each index slows down INSERT/UPDATE/DELETE — measure write impact, not just read gains.",
    tags: ["sql", "indexing"] }),

  Q({ id: next(), topic: "sql-db", topicLabel: "SQL & Databases", subtopic: "Performance", difficulty: "medium",
    question: "How do you analyze and optimize a slow query?",
    answer: "1) Reproduce + measure. 2) `EXPLAIN ANALYZE` — look for Seq Scan on big tables, sort spills, nested loop on large rows. 3) Add/adjust indexes (composite to cover filter+sort), rewrite to remove `SELECT *`, push filters down, replace correlated subqueries with joins, batch N+1 patterns. 4) Check stats (`ANALYZE`), partitioning for huge tables, and connection pool sizing.",
    proTip: "Always test on production-like data volume — a query that's fast on 1k rows can be O(n²) on 10M.",
    tags: ["sql", "explain"] }),

  Q({ id: next(), topic: "sql-db", topicLabel: "SQL & Databases", subtopic: "Stored Procs", difficulty: "medium",
    question: "What are stored procedures and when did you use them?",
    answer: "Precompiled SQL routines stored in the DB; called by name with parameters. Pros: reduce network round trips, encapsulate complex multi-statement logic, enforce data-access rules. Cons: business logic in two places, harder to version-control and test, vendor lock-in. Used in **AI English Tutor** for batch grading and lesson-progress aggregations to avoid pulling thousands of rows over the wire.",
    proTip: "Modern preference: keep logic in the app layer; use procs only for performance-critical, set-based ops or for security boundaries.",
    tags: ["sql", "stored-proc"], resumeLink: "AI English Tutor" }),

  Q({ id: next(), topic: "sql-db", topicLabel: "SQL & Databases", subtopic: "Normalization", difficulty: "easy",
    question: "Explain 1NF, 2NF, 3NF, BCNF in plain terms.",
    answer: "**1NF** — atomic values, no repeating groups. **2NF** — 1NF + no partial dependency on a composite PK. **3NF** — 2NF + no transitive dependency (non-key → non-key). **BCNF** — stricter 3NF where every determinant is a candidate key. Normalize for integrity; **denormalize** for read performance (reporting, hot dashboards).",
    proTip: "OLTP → normalize. OLAP / read-heavy analytics → denormalize (star/snowflake schema).",
    tags: ["sql", "normalization"] }),

  Q({ id: next(), topic: "sql-db", topicLabel: "SQL & Databases", subtopic: "SQL vs NoSQL", difficulty: "medium",
    question: "When to use MySQL vs MongoDB?",
    answer: "**MySQL/PostgreSQL** — strong schema, ACID, complex relational queries, transactions across rows. Pick for banking, orders, anything with strict consistency. **MongoDB** — flexible schema, horizontal scale via sharding, document-shaped data (chat messages, product catalogs, IoT events). I used PostgreSQL for BarathAI structured data and MongoDB for chat message history (high write throughput, naturally document-shaped).",
    proTip: "MongoDB now supports ACID multi-doc transactions, and PostgreSQL has JSONB — the line is blurring. Pick by access pattern, not buzzword.",
    tags: ["sql", "nosql"], resumeLink: "BarathAI Chat" }),

  Q({ id: next(), topic: "sql-db", topicLabel: "SQL & Databases", subtopic: "PostgreSQL", difficulty: "medium",
    question: "PostgreSQL specifics — foreign keys and schema design from BarathAI.",
    answer: "Used `REFERENCES ... ON DELETE CASCADE` for owned children (e.g. messages → conversation), `ON DELETE SET NULL` for soft links. Schema: `users`, `conversations`, `messages`, `attachments`, indexed on `(conversation_id, created_at DESC)` for fast pagination of latest messages. Used `JSONB` for flexible message metadata, `UUID` PKs, partial indexes for active conversations only.",
    proTip: "Always create the FK + a matching index on the child column — Postgres doesn't auto-index FKs and joins crawl without it.",
    tags: ["postgres", "schema"], resumeLink: "BarathAI Chat" }),

  Q({ id: next(), topic: "sql-db", topicLabel: "SQL & Databases", subtopic: "Transactions", difficulty: "medium",
    question: "Explain ACID and isolation levels.",
    answer: "**Atomicity** — all or nothing. **Consistency** — invariants preserved. **Isolation** — concurrent tx don't see each other's partial state. **Durability** — committed data survives crashes. **Levels (weakest→strongest):** READ UNCOMMITTED (dirty reads), READ COMMITTED (default in Postgres), REPEATABLE READ (default in MySQL/InnoDB), SERIALIZABLE. Each level prevents specific anomalies (dirty/non-repeatable/phantom reads).",
    proTip: "Higher isolation = more locks/aborts = less throughput. Pick the lowest level that prevents the anomaly your business cares about.",
    tags: ["sql", "acid"] }),

  Q({ id: next(), topic: "sql-db", topicLabel: "SQL & Databases", subtopic: "Project", difficulty: "hard",
    question: "How did you reduce database query time by 40% in BarathAI?",
    answer: "Profiled with `EXPLAIN ANALYZE`. Wins: (1) added composite index `(conversation_id, created_at DESC)` for message pagination, (2) replaced `SELECT *` with projections, (3) introduced cursor-based pagination instead of OFFSET for chat history, (4) batched N+1 user-lookup with a single `IN (...)` query, (5) Redis cache-aside for active conversation metadata, (6) connection pool tuned (HikariCP min/max). Combined p95 read latency dropped ~40%.",
    proTip: "Always quantify — interviewers love 'before vs after p95 numbers + the one change that mattered most'.",
    tags: ["sql", "performance"], resumeLink: "BarathAI Chat 40% improvement" }),

  Q({ id: next(), topic: "sql-db", topicLabel: "SQL & Databases", subtopic: "Window Functions", difficulty: "medium",
    question: "What are window functions and when to use them?",
    answer: "Compute aggregates *over a window* of rows without collapsing them: `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LAG/LEAD`, running totals (`SUM() OVER (PARTITION BY x ORDER BY y)`). Perfect for top-N-per-group, deduplication, time-series diffs.",
    proTip: "Top-N-per-group is the canonical use: `ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC)` then `WHERE rn = 1`.",
    codeSnippet: `SELECT id, customer_id, amount,
       SUM(amount) OVER (PARTITION BY customer_id ORDER BY created_at) AS running_total
FROM loans;`,
    tags: ["sql", "window"] }),

  // ============ REACT (8) ============
  Q({ id: next(), topic: "react", topicLabel: "React.js & Frontend", subtopic: "Hooks", difficulty: "easy",
    question: "Explain useState, useEffect, useContext, useRef.",
    answer: "**useState** — local component state with setter. **useEffect** — side effects after render; cleanup via returned function; deps array controls when it re-runs. **useContext** — read context value without prop drilling. **useRef** — mutable container that persists across renders without causing re-render; also for DOM refs.",
    proTip: "Empty deps `[]` = once on mount; missing deps = every render; explicit deps = on change. Use the ESLint exhaustive-deps rule.",
    codeSnippet: `const [msgs, setMsgs] = useState([]);
useEffect(() => {
    const id = setInterval(fetchMsgs, 5000);
    return () => clearInterval(id);
}, []);`,
    tags: ["react", "hooks"] }),

  Q({ id: next(), topic: "react", topicLabel: "React.js & Frontend", subtopic: "Internals", difficulty: "medium",
    question: "Virtual DOM, reconciliation, and React Fiber — what are they?",
    answer: "**Virtual DOM** — in-memory tree of React elements. On state change, React builds a new VDOM and **diffs** it against the previous (reconciliation), applying minimal real-DOM updates. **Fiber** (since React 16) is the reimplementation that splits work into units, allowing pauses, prioritization (urgent input vs background data), and concurrent rendering.",
    proTip: "Stable `key` props are critical for list reconciliation — using array index as key causes subtle bugs on reorder.",
    tags: ["react", "fiber"] }),

  Q({ id: next(), topic: "react", topicLabel: "React.js & Frontend", subtopic: "State Mgmt", difficulty: "medium",
    question: "Context API vs Redux — when to use which?",
    answer: "**Context** — built-in, great for low-frequency global values (theme, auth user, locale). Re-renders all consumers when value changes — bad for high-frequency state. **Redux (Toolkit)** — predictable global store, time-travel debugging, middleware (thunk/saga), great for large apps with complex shared state. Modern alternatives: Zustand, Jotai, TanStack Query (server state).",
    proTip: "For server data, use TanStack Query — caches, dedupes, refetches. Don't put server data in Redux.",
    tags: ["react", "redux"] }),

  Q({ id: next(), topic: "react", topicLabel: "React.js & Frontend", subtopic: "Routing", difficulty: "easy",
    question: "How do you implement protected routes with React Router v6?",
    answer: "Wrap children in a `<RequireAuth>` component that reads auth state and either renders `<Outlet />` (or children) or `<Navigate to=\"/login\" replace state={{from: location}}/>`. Use route-level layouts via `<Route element={<RequireAuth/>}>` to group protected routes.",
    proTip: "Persist `from` location and redirect back after login — small UX touch interviewers notice.",
    codeSnippet: `function RequireAuth() {
    const { user } = useAuth();
    const loc = useLocation();
    return user ? <Outlet/> : <Navigate to="/login" state={{from: loc}} replace/>;
}`,
    tags: ["react-router"] }),

  Q({ id: next(), topic: "react", topicLabel: "React.js & Frontend", subtopic: "API", difficulty: "easy",
    question: "Best practices for API integration with Axios/fetch?",
    answer: "Centralize a client (`api.ts`) with base URL, interceptors for auth header injection, and 401 → refresh-token → retry flow. Handle errors with try/catch + typed error objects. Cancel in-flight requests on unmount (AbortController). Use TanStack Query for caching, retries, background refetch.",
    proTip: "Always show a loading state and an error state — never just a blank screen on slow networks.",
    tags: ["react", "api"] }),

  Q({ id: next(), topic: "react", topicLabel: "React.js & Frontend", subtopic: "Performance", difficulty: "hard",
    question: "Performance optimization — React.memo, useMemo, useCallback.",
    answer: "**React.memo** — skip re-render if props are shallow-equal. **useMemo** — memoize expensive computations across renders. **useCallback** — memoize function identity (so memoized children don't re-render). Also: code splitting (`React.lazy` + `Suspense`), virtualization for long lists (`react-window`), avoiding inline objects/arrays in props.",
    proTip: "Don't memo everything — measure first with React DevTools Profiler. Premature memoization adds memory and complexity for no gain.",
    tags: ["react", "perf"] }),

  Q({ id: next(), topic: "react", topicLabel: "React.js & Frontend", subtopic: "Project", difficulty: "medium",
    question: "How did you build the BarathAI Chat UI?",
    answer: "React + TypeScript + Tailwind. Component tree: `ChatLayout → Sidebar (conversations) + ChatWindow (MessageList + Composer)`. WebSocket via STOMP for real-time messages, with optimistic UI (append local msg immediately, reconcile on ack). Virtualized message list for long histories. JWT in httpOnly cookie + Axios interceptor for auth. Reconnection w/ exponential backoff. Reached 100+ concurrent users.",
    proTip: "Be ready for 'how did you handle dropped connections?' — heartbeats + visible 'reconnecting' state + queued outbound messages flushed on reconnect.",
    tags: ["react", "websocket"], resumeLink: "BarathAI Chat" }),

  Q({ id: next(), topic: "react", topicLabel: "React.js & Frontend", subtopic: "Styling", difficulty: "easy",
    question: "Why Tailwind CSS — what is the utility-first approach?",
    answer: "Compose styles from small atomic utility classes (`flex`, `p-4`, `text-sm`) directly in markup. Pros: no naming overhead, consistent design tokens via config, dead-code elimination at build (purge), fast iteration, mobile-first responsive variants. Cons: noisy markup — extract repeated patterns into components or `@apply`.",
    proTip: "Use semantic tokens in `tailwind.config` (`primary`, `surface`) instead of raw colors — themable and consistent.",
    tags: ["react", "tailwind"] }),

  // ============ AWS (6) ============
  Q({ id: next(), topic: "aws", topicLabel: "AWS & Cloud Deployment", subtopic: "Core", difficulty: "easy",
    question: "Explain EC2, S3, RDS, and Lambda in one line each.",
    answer: "**EC2** — virtual servers (compute). **S3** — object storage (files, backups, static sites). **RDS** — managed relational DB (MySQL/Postgres) with automated backups, failover, read replicas. **Lambda** — serverless functions, billed per ms, auto-scales, ideal for event-driven and glue code.",
    proTip: "Know one cost trade-off: Lambda is amazing until you hit constant high RPS — then EC2/Fargate becomes cheaper.",
    tags: ["aws"] }),

  Q({ id: next(), topic: "aws", topicLabel: "AWS & Cloud Deployment", subtopic: "ALB", difficulty: "medium",
    question: "What does an Application Load Balancer (ALB) do?",
    answer: "Layer-7 load balancer: routes HTTP(S) by host/path/headers, terminates TLS, supports WebSocket and HTTP/2, integrates with WAF, target groups (EC2, ECS, Lambda), health checks for instance removal. Used at KUWY to fan traffic across Auto Scaling group of API instances and route `/api/loans/*` vs `/api/customers/*` to different target groups.",
    proTip: "Sticky sessions are a code smell at scale — push session state to Redis so any instance can serve any request.",
    tags: ["aws", "alb"], resumeLink: "ALB at KUWY" }),

  Q({ id: next(), topic: "aws", topicLabel: "AWS & Cloud Deployment", subtopic: "Auto Scaling", difficulty: "medium",
    question: "How do Auto Scaling groups and scaling policies work?",
    answer: "ASG keeps a target number of instances using a Launch Template across AZs. **Scaling policies:** **target tracking** (keep CPU at 60%), **step scaling** (rules per CloudWatch threshold), **scheduled** (predictable load), **predictive** (ML-based). Health-check failures auto-replace instances. Combine with ALB for elastic capacity.",
    proTip: "Warm-up time matters — set `HealthCheckGracePeriod` long enough for the JVM to JIT and connect pools to fill before counting health checks.",
    tags: ["aws", "asg"], resumeLink: "Auto Scaling at KUWY" }),

  Q({ id: next(), topic: "aws", topicLabel: "AWS & Cloud Deployment", subtopic: "Security", difficulty: "medium",
    question: "Explain IAM roles, security groups, and VPC basics.",
    answer: "**IAM role** — set of permissions assumed by a service/user (EC2 role to read S3 — no static keys on instance). **Security group** — stateful instance-level firewall (inbound/outbound rules). **VPC** — isolated virtual network with public/private subnets, route tables, NAT Gateway (private→internet), Internet Gateway (public→internet). Apps in private subnets, ALB in public subnet.",
    proTip: "Least privilege always — never attach `AdministratorAccess` to app roles. Use IAM Access Analyzer to spot over-permissive policies.",
    tags: ["aws", "iam", "vpc"] }),

  Q({ id: next(), topic: "aws", topicLabel: "AWS & Cloud Deployment", subtopic: "CI/CD", difficulty: "medium",
    question: "How do you set up CI/CD with GitHub Actions / CodePipeline?",
    answer: "**GitHub Actions:** workflow on push → checkout → setup Java → `mvn verify` → build Docker image → push to ECR → trigger ECS/EC2 deploy (or `aws codedeploy create-deployment`). Use OIDC to assume an AWS role (no long-lived keys). Separate jobs for test, build, deploy with manual approval gate before prod.",
    proTip: "Cache Maven/Gradle dependencies between runs — cuts CI time dramatically; use `actions/cache` keyed on lockfile hash.",
    tags: ["ci-cd", "github-actions"] }),

  Q({ id: next(), topic: "aws", topicLabel: "AWS & Cloud Deployment", subtopic: "Project", difficulty: "hard",
    question: "How did you deploy your banking APIs on AWS?",
    answer: "Spring Boot apps Dockerized, pushed to ECR, deployed to EC2 instances (later containerized) behind ALB with Auto Scaling across two AZs. RDS MySQL (Multi-AZ) for primary data, ElastiCache Redis for caching, S3 for KYC document storage. CloudWatch + custom metrics for monitoring; alarms triggered scale-out or PagerDuty alerts. CI/CD via GitHub Actions → ECR → CodeDeploy with blue/green for zero-downtime releases.",
    proTip: "When asked about cost, mention Reserved Instances / Savings Plans for steady baseline + Spot for batch/non-critical.",
    tags: ["aws", "project"], resumeLink: "AWS deployment @ KUWY" }),

  // ============ WEBSOCKET (4) ============
  Q({ id: next(), topic: "websocket", topicLabel: "WebSocket & Real-Time", subtopic: "Concepts", difficulty: "easy",
    question: "WebSocket vs HTTP polling vs Server-Sent Events?",
    answer: "**Polling** — client repeatedly asks; wasteful, high latency. **Long polling** — server holds request until data; better but still per-message overhead. **SSE** — server→client stream over HTTP; one-way, auto-reconnect, simple. **WebSocket** — full-duplex, low overhead after handshake, ideal for chat/games/trading. Use SSE for one-way push (notifications), WebSocket for two-way (chat, collaborative editing).",
    proTip: "Mention HTTP/2 push and HTTP/3 — sometimes plain SSE on HTTP/2 is enough and simpler than WebSocket.",
    tags: ["websocket"] }),

  Q({ id: next(), topic: "websocket", topicLabel: "WebSocket & Real-Time", subtopic: "STOMP", difficulty: "medium",
    question: "How does STOMP work with Spring Boot WebSocket?",
    answer: "STOMP is a text framing protocol on top of WebSocket: SUBSCRIBE/SEND/MESSAGE frames. Spring `@EnableWebSocketMessageBroker` registers an endpoint and a simple in-memory broker (or RabbitMQ/ActiveMQ for distributed). Map handlers with `@MessageMapping` and target user-specific destinations via `convertAndSendToUser`. Clients use stomp.js / SockJS for fallback.",
    proTip: "For multi-instance deployments, swap the simple broker for a real broker (RabbitMQ STOMP plugin) so messages reach users connected to other nodes.",
    codeSnippet: `@MessageMapping("/chat.send")
public void send(ChatMessage msg, Principal user) {
    msg.setFrom(user.getName());
    template.convertAndSend("/topic/room." + msg.getRoom(), msg);
}`,
    tags: ["websocket", "stomp"] }),

  Q({ id: next(), topic: "websocket", topicLabel: "WebSocket & Real-Time", subtopic: "Scaling", difficulty: "hard",
    question: "How do you scale WebSocket connections (handled 100+ concurrent users)?",
    answer: "Use a non-blocking server (Netty/Undertow — Spring Boot defaults work). Tune OS file descriptors and Tomcat/Undertow IO threads. Behind ALB enable WebSocket support + sticky sessions. For multi-node, use an external broker (RabbitMQ/Redis Pub/Sub) so a message published on node A reaches subscribers on node B. Heartbeats + reconnect with backoff on client. Track connections per user to apply rate/connection limits.",
    proTip: "100+ is small — for 10k+, you need backpressure on the producer side and binary frames + msgpack/protobuf to cut bandwidth.",
    tags: ["websocket", "scaling"], resumeLink: "BarathAI Chat 100+ users" }),

  Q({ id: next(), topic: "websocket", topicLabel: "WebSocket & Real-Time", subtopic: "Project", difficulty: "medium",
    question: "How did you implement real-time messaging in BarathAI?",
    answer: "Spring Boot WebSocket + STOMP endpoint `/ws-chat`, JWT-authenticated during the CONNECT frame via a `ChannelInterceptor`. Client (React + stomp.js) subscribed to `/user/queue/messages` for direct messages and `/topic/room.{id}` for rooms. Messages persisted to MongoDB asynchronously, then broadcast. Optimistic UI on the React side, with ack reconciliation. Heartbeats every 25s; auto-reconnect with exponential backoff; queued outbound messages flushed on reconnect.",
    proTip: "Mention idempotency — assign a client-side `tempId` per message so retries on reconnect don't duplicate.",
    tags: ["websocket", "project"], resumeLink: "BarathAI Chat" }),

  // ============ AUTH/SECURITY (5) ============
  Q({ id: next(), topic: "auth-security", topicLabel: "Authentication & Security", subtopic: "JWT", difficulty: "medium",
    question: "Explain JWT structure and a refresh-token strategy.",
    answer: "JWT = `base64url(header).base64url(payload).signature`. Header has alg (HS256/RS256). Payload has claims (`sub`, `exp`, custom). Signature verifies integrity + (with RS256) origin. **Strategy:** short-lived access token (5–15 min) + long-lived refresh token stored in httpOnly Secure cookie. Client hits `/refresh` to rotate when access expires. Maintain a server-side refresh token store for revocation.",
    proTip: "Never store JWTs in `localStorage` for sensitive apps — XSS steals them. Use httpOnly cookies + CSRF protection.",
    codeSnippet: `String token = Jwts.builder()
    .setSubject(user.getId().toString())
    .claim("roles", user.getRoles())
    .setIssuedAt(new Date())
    .setExpiration(Date.from(Instant.now().plus(15, ChronoUnit.MINUTES)))
    .signWith(key, SignatureAlgorithm.HS256)
    .compact();`,
    tags: ["jwt", "auth"] }),

  Q({ id: next(), topic: "auth-security", topicLabel: "Authentication & Security", subtopic: "Hashing", difficulty: "medium",
    question: "Why bcrypt and not MD5/SHA — what about salt rounds?",
    answer: "MD5/SHA are *fast* hashes built for integrity; attackers can brute-force billions/sec on GPUs. **bcrypt** is intentionally **slow** and **memory-bound**, with a built-in **salt** (defeats rainbow tables) and a tunable **cost factor** (work doubles per +1). As hardware improves, bump the cost. Alternatives: Argon2 (modern winner), scrypt.",
    proTip: "Pick a cost so a single hash takes ~250ms on your prod hardware — slow enough to deter brute force, fast enough not to DoS your auth endpoint.",
    codeSnippet: `BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
String hash = encoder.encode(rawPassword);
boolean ok = encoder.matches(rawPassword, hash);`,
    tags: ["bcrypt", "hashing"] }),

  Q({ id: next(), topic: "auth-security", topicLabel: "Authentication & Security", subtopic: "Spring Security", difficulty: "hard",
    question: "Explain the Spring Security filter chain and @PreAuthorize.",
    answer: "Every request passes through an ordered chain of servlet filters: `SecurityContextPersistenceFilter`, `UsernamePasswordAuthenticationFilter` (form login), custom `JwtAuthFilter` (extract token, set `Authentication`), `ExceptionTranslationFilter`, `FilterSecurityInterceptor` (URL-based authz). After that, **method-level** `@PreAuthorize(\"hasRole('ADMIN')\")` / `@PostAuthorize` enforce rules at service methods.",
    proTip: "Custom JWT filter goes *before* `UsernamePasswordAuthenticationFilter` via `addFilterBefore` — common gotcha.",
    tags: ["spring-security"] }),

  Q({ id: next(), topic: "auth-security", topicLabel: "Authentication & Security", subtopic: "OAuth", difficulty: "medium",
    question: "OAuth 2.0 vs OpenID Connect — what's the difference?",
    answer: "**OAuth 2.0** is an *authorization* framework — delegated access to resources via access tokens (Authorization Code + PKCE is the recommended flow for SPAs/mobile). **OpenID Connect (OIDC)** layers *authentication* on top — adds an `id_token` (a JWT identifying the user) and a `/userinfo` endpoint. Use OIDC for 'login with Google'; use plain OAuth for API access delegation.",
    proTip: "For SPAs, always use Authorization Code + PKCE (not implicit flow — deprecated for security).",
    tags: ["oauth", "oidc"] }),

  Q({ id: next(), topic: "auth-security", topicLabel: "Authentication & Security", subtopic: "Project", difficulty: "hard",
    question: "How did you reduce API latency by 150ms with bcrypt tuning?",
    answer: "Original cost factor was over-tuned (cost=14 → ~700ms per login on prod CPUs), throttling auth throughput. Re-benchmarked on actual prod hardware, dropped cost to 12 (~250ms), still well above OWASP's recommended floor. Combined with: enabling HTTP keep-alive, moving JWT signing to a cached `Key`, and async audit logging. Login endpoint p95 dropped ~150ms with no security regression.",
    proTip: "Always benchmark hashing cost on production-class CPUs — devbox numbers are misleading.",
    tags: ["bcrypt", "performance"], resumeLink: "Auth latency improvement" }),

  // ============ DESIGN PATTERNS / SYSTEM DESIGN (8) ============
  Q({ id: next(), topic: "design-patterns", topicLabel: "Design Patterns & System Design", subtopic: "Creational", difficulty: "medium",
    question: "Implement a thread-safe Singleton in Java.",
    answer: "Best options: (1) **Enum singleton** — JVM-guaranteed single instance, serialization-safe. (2) **Initialization-on-Demand Holder** — lazy + thread-safe via JVM class-loading semantics. Avoid double-checked locking pre-Java-5; from Java 5+ it works only with `volatile`.",
    proTip: "Joshua Bloch (Effective Java) recommends Enum — it's the simplest and prevents reflection attacks.",
    codeSnippet: `public enum Config { INSTANCE;
    public String getEnv() { return System.getenv("APP_ENV"); }
}
// Holder idiom:
public class Lazy {
    private Lazy() {}
    private static class H { static final Lazy I = new Lazy(); }
    public static Lazy get() { return H.I; }
}`,
    tags: ["singleton", "patterns"] }),

  Q({ id: next(), topic: "design-patterns", topicLabel: "Design Patterns & System Design", subtopic: "Patterns", difficulty: "medium",
    question: "Explain Factory, Builder, Observer, Strategy patterns with examples.",
    answer: "**Factory** — encapsulate object creation (`PaymentGatewayFactory.create(\"razorpay\")`). **Builder** — fluent step-by-step construction for objects with many optional params (`Loan.builder().amount(...).tenure(...).build()`). **Observer** — pub/sub; Spring's `ApplicationEventPublisher` + `@EventListener`. **Strategy** — pluggable algorithms behind a common interface (`InterestStrategy` with Fixed/Floating implementations).",
    proTip: "Spring uses many of these under the hood — call them out: `BeanFactory` (factory), Events (observer), `RestTemplate`/`RestClient.builder()` (builder).",
    tags: ["patterns"] }),

  Q({ id: next(), topic: "design-patterns", topicLabel: "Design Patterns & System Design", subtopic: "Architecture", difficulty: "easy",
    question: "Explain MVC architecture and how you enforced it at KUWY.",
    answer: "**Model** — domain entities + business logic. **View** — presentation (JSON for APIs, templates for server-rendered). **Controller** — receives requests, orchestrates services, returns response. At KUWY: `@RestController` was thin (validation + delegation), `@Service` held business logic, `@Repository` handled persistence; DTOs at the boundary kept entities out of the API surface. Code reviews enforced 'no business logic in controllers, no JPA in controllers'.",
    proTip: "Add a hexagonal/ports-and-adapters touch — keep domain pure, push framework concerns (JPA, web) to the edges.",
    tags: ["mvc", "architecture"], resumeLink: "MVC at KUWY" }),

  Q({ id: next(), topic: "design-patterns", topicLabel: "Design Patterns & System Design", subtopic: "Caching", difficulty: "medium",
    question: "Cache-aside vs Write-through caching patterns.",
    answer: "**Cache-aside (lazy loading):** app reads cache → on miss, reads DB and populates cache → returns. Writes go to DB and **invalidate** cache. Simple, resilient to cache outage; risk of stale data on invalidation gaps. **Write-through:** writes go through cache → cache writes to DB synchronously. Always consistent but slower writes and cache becomes a SPOF. **Write-behind:** async DB write — fast but risk of data loss on crash.",
    proTip: "For read-heavy systems with rare writes, cache-aside + TTL is the safe default. Add a fallback for cache outages.",
    tags: ["cache", "patterns"] }),

  Q({ id: next(), topic: "design-patterns", topicLabel: "Design Patterns & System Design", subtopic: "SOLID", difficulty: "medium",
    question: "Explain the SOLID principles with Java examples.",
    answer: "**S**ingle Responsibility — a class has one reason to change. **O**pen/Closed — open for extension, closed for modification (Strategy pattern). **L**iskov Substitution — subtypes must be usable wherever the base type is, without surprises. **I**nterface Segregation — many small interfaces over one fat one. **D**ependency Inversion — depend on abstractions, not concretions (constructor inject `PaymentGateway`, not `RazorpayClient`).",
    proTip: "When asked 'where do you see SOLID violated?' — point to god services, anemic domain models, and `instanceof` chains (LSP smell).",
    tags: ["solid"] }),

  Q({ id: next(), topic: "design-patterns", topicLabel: "Design Patterns & System Design", subtopic: "System Design", difficulty: "hard",
    question: "Design a Banking Loan Processing System.",
    answer: "Bounded contexts as services: **Customer/KYC**, **Loan Origination**, **Underwriting/Credit Scoring**, **Disbursement** (bank integration), **Repayment/EMI**, **Notifications**. API Gateway with JWT auth + rate limiting. Sync REST for queries; **Kafka** events for state changes (`LoanApproved`, `Disbursed`) — consumers update read models, send SMS/email, accounting entries. Each service owns its DB (MySQL). Redis for KYC cache. Resilience4j around third-party (Aadhar/PAN/RC). Outbox pattern for reliable event publishing. Audit log table for compliance. Deployed on AWS ECS + ALB + Auto Scaling, RDS Multi-AZ, ElastiCache, S3 for documents. Observability: Micrometer → Prometheus → Grafana; Sleuth → Zipkin.",
    proTip: "Drive it top-down: requirements → APIs → data model → services → scale/SLA → failure modes. Don't dive into Kafka topics first.",
    tags: ["system-design", "banking"], resumeLink: "Banking Loans @ KUWY" }),

  Q({ id: next(), topic: "design-patterns", topicLabel: "Design Patterns & System Design", subtopic: "System Design", difficulty: "hard",
    question: "Design a Real-Time Chat Application (BarathAI-style).",
    answer: "Stateless API gateway. WebSocket gateway (Spring + STOMP) horizontally scaled behind ALB with sticky sessions; backed by RabbitMQ STOMP broker so messages cross nodes. Auth via JWT during CONNECT. Persistence: PostgreSQL for users/conversations metadata, MongoDB for messages (high write throughput, document shape). Redis for presence (online users, last-seen) with TTL. Push to offline users via FCM/APNs from a notification service consuming Kafka. Read models for unread counts. Object storage (S3) for attachments with pre-signed URLs.",
    proTip: "Cover delivery semantics — at-least-once with client-side idempotency keys to dedupe; message ordering per conversation via partitioning by conversation id.",
    tags: ["system-design", "chat"], resumeLink: "BarathAI Chat" }),

  Q({ id: next(), topic: "design-patterns", topicLabel: "Design Patterns & System Design", subtopic: "System Design", difficulty: "hard",
    question: "Design a URL Shortener with rate limiting.",
    answer: "Generate short code via base62 of an auto-increment ID, or hash(url)+collision retry. Persist `(short_code → long_url, owner, created_at, expires_at)` in a sharded SQL DB or Cassandra for write scale. Redis cache for hot mappings (`GET /{code}` is read-heavy). 301/302 redirects (302 if you need analytics on each click). **Rate limiting:** token bucket per API key in Redis (`INCR` + `EXPIRE`); respond 429 + `Retry-After`. Async analytics pipeline: emit click event to Kafka → ClickHouse for aggregations.",
    proTip: "Discuss read/write ratio (~100:1 in URL shorteners) — shapes your caching and DB choice.",
    tags: ["system-design", "url-shortener"] }),

  // ============ DEVOPS (4) ============
  Q({ id: next(), topic: "devops", topicLabel: "Git, CI/CD & DevOps", subtopic: "Git", difficulty: "easy",
    question: "Compare GitFlow vs trunk-based branching strategies.",
    answer: "**GitFlow** — long-lived `develop`, `main`, `feature/*`, `release/*`, `hotfix/*`. Heavy ceremony, suits scheduled releases. **Trunk-based** — short-lived feature branches (hours/days) merged into `main` behind feature flags; `main` always deployable. Modern CI/CD favors trunk-based for fast, safe delivery.",
    proTip: "Combine trunk-based with feature flags (LaunchDarkly / Unleash) to ship code dark and release independently of deploy.",
    tags: ["git"] }),

  Q({ id: next(), topic: "devops", topicLabel: "Git, CI/CD & DevOps", subtopic: "Git", difficulty: "medium",
    question: "Merge vs Rebase, cherry-pick, and stash — when to use each?",
    answer: "**Merge** preserves history with a merge commit — safe for shared branches. **Rebase** rewrites your branch on top of target — clean linear history; never rebase shared/public branches. **Cherry-pick** applies a specific commit elsewhere (hotfix to release branch). **Stash** temporarily shelves uncommitted changes to switch branches.",
    proTip: "Rule of thumb: 'rebase locally, merge to share'. And use `git pull --rebase` to keep your local feature branch tidy.",
    tags: ["git"] }),

  Q({ id: next(), topic: "devops", topicLabel: "Git, CI/CD & DevOps", subtopic: "CI/CD", difficulty: "medium",
    question: "How do you set up a CI/CD pipeline with GitHub Actions?",
    answer: "Workflow file `.github/workflows/ci.yml` triggers on push/PR. Jobs: **test** (checkout → setup-java → cache Maven → `mvn verify`), **build** (build Docker image, tag with SHA, push to ECR via OIDC), **deploy** (call AWS CodeDeploy / `kubectl apply`). Add manual approval for prod, use environment secrets, and matrix builds across JDK versions if needed.",
    proTip: "Always cache dependencies and run tests in parallel matrices to keep CI under 5 minutes — slow CI kills team velocity.",
    codeSnippet: `name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: '17', cache: maven }
      - run: mvn -B verify`,
    tags: ["github-actions"] }),

  Q({ id: next(), topic: "devops", topicLabel: "Git, CI/CD & DevOps", subtopic: "Build Tools", difficulty: "easy",
    question: "Maven vs Gradle build lifecycle — what are the differences?",
    answer: "**Maven** — XML config (`pom.xml`), opinionated lifecycle (`validate → compile → test → package → verify → install → deploy`), huge plugin ecosystem, predictable. **Gradle** — Groovy/Kotlin DSL, task graph (DAG), incremental builds, build cache → much faster on large projects, more flexible.",
    proTip: "For new projects pick Gradle for speed; for existing enterprise (and most Spring tutorials) Maven is still king and easier to onboard juniors to.",
    tags: ["maven", "gradle"] }),

  // ============ CODING CHALLENGES (8) ============
  Q({ id: next(), topic: "coding-challenges", topicLabel: "Coding Challenges", subtopic: "Linked List", difficulty: "easy",
    question: "Reverse a linked list — iterative AND recursive.",
    answer: "**Iterative**: O(n) time, O(1) space — flip pointers in place. **Recursive**: O(n) time, O(n) stack — recurse to tail, then on the way up, set `head.next.next = head; head.next = null;`.",
    proTip: "State trade-off: iterative wins on large lists due to constant space; recursive risks stack overflow.",
    codeSnippet: `// Iterative
ListNode reverse(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) { ListNode n = cur.next; cur.next = prev; prev = cur; cur = n; }
    return prev;
}
// Recursive
ListNode reverseR(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode newHead = reverseR(head.next);
    head.next.next = head; head.next = null;
    return newHead;
}`,
    tags: ["linked-list", "reverse"] }),

  Q({ id: next(), topic: "coding-challenges", topicLabel: "Coding Challenges", subtopic: "Design", difficulty: "hard",
    question: "Implement an LRU Cache with O(1) get and put.",
    answer: "Doubly linked list (most-recent at head, least-recent at tail) + HashMap from key → node. On get: move node to head. On put: insert at head; if over capacity, evict tail; update map. Java shortcut: `LinkedHashMap` with `accessOrder=true` and override `removeEldestEntry`.",
    proTip: "Mention both: 'LinkedHashMap-based one-liner for production simplicity, manual DLL+HashMap to prove I understand it'.",
    codeSnippet: `class LRUCache extends LinkedHashMap<Integer,Integer> {
    private final int cap;
    public LRUCache(int cap) {
        super(cap, 0.75f, true);
        this.cap = cap;
    }
    public int get(int k) { return getOrDefault(k, -1); }
    public void put(int k, int v) { super.put(k, v); }
    protected boolean removeEldestEntry(Map.Entry<Integer,Integer> e) {
        return size() > cap;
    }
}`,
    tags: ["lru", "design"] }),

  Q({ id: next(), topic: "coding-challenges", topicLabel: "Coding Challenges", subtopic: "Arrays", difficulty: "easy",
    question: "Find duplicates in an array — multiple approaches.",
    answer: "(1) **HashSet** — O(n) time, O(n) space; add to set, if already present → duplicate. (2) **Sort + scan** — O(n log n), O(1). (3) For integers in [1..n], **mark by negation**: visit `a[abs(x)-1]`, negate; if already negative → duplicate. O(n)/O(1).",
    proTip: "Always ask 'what's the value range?' — unlocks the in-place trick.",
    codeSnippet: `Set<Integer> findDuplicates(int[] a) {
    Set<Integer> seen = new HashSet<>(), dup = new HashSet<>();
    for (int x : a) if (!seen.add(x)) dup.add(x);
    return dup;
}`,
    tags: ["arrays", "hashing"] }),

  Q({ id: next(), topic: "coding-challenges", topicLabel: "Coding Challenges", subtopic: "Stack", difficulty: "easy",
    question: "Valid parentheses using a stack.",
    answer: "Push openers, on a closer pop and check it matches. Empty stack at end = valid. O(n)/O(n).",
    proTip: "Edge cases interviewers love: empty string (valid), single char (invalid), unmatched closer first.",
    codeSnippet: `boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c=='(' || c=='[' || c=='{') st.push(c);
        else {
            if (st.isEmpty()) return false;
            char o = st.pop();
            if ((c==')'&&o!='(')||(c==']'&&o!='[')||(c=='}'&&o!='{')) return false;
        }
    }
    return st.isEmpty();
}`,
    tags: ["stack"] }),

  Q({ id: next(), topic: "coding-challenges", topicLabel: "Coding Challenges", subtopic: "Graphs", difficulty: "medium",
    question: "BFS and DFS traversal of a graph.",
    answer: "**BFS** — queue + visited set, level-by-level (shortest hops in unweighted graph). **DFS** — recursion or stack; great for connectivity and cycle detection.",
    proTip: "For 'shortest path in unweighted grid', BFS is the answer. For 'all paths/exists path', DFS is usually simpler.",
    codeSnippet: `void bfs(int start, List<List<Integer>> g) {
    boolean[] vis = new boolean[g.size()];
    Queue<Integer> q = new ArrayDeque<>(); q.add(start); vis[start]=true;
    while (!q.isEmpty()) {
        int u = q.poll();
        for (int v : g.get(u))
            if (!vis[v]) { vis[v]=true; q.add(v); }
    }
}`,
    tags: ["graphs", "bfs", "dfs"] }),

  Q({ id: next(), topic: "coding-challenges", topicLabel: "Coding Challenges", subtopic: "Stack", difficulty: "medium",
    question: "Design a stack with getMin() in O(1).",
    answer: "Two stacks: main + min stack tracking running minimum (push min(top, x) on each push). All ops O(1).",
    proTip: "Optimization: only push to the min stack when new value <= current min — saves memory.",
    codeSnippet: `class MinStack {
    Deque<Integer> st = new ArrayDeque<>(), mins = new ArrayDeque<>();
    public void push(int x) {
        st.push(x);
        if (mins.isEmpty() || x <= mins.peek()) mins.push(x);
    }
    public void pop() {
        if (st.pop().equals(mins.peek())) mins.pop();
    }
    public int top() { return st.peek(); }
    public int getMin() { return mins.peek(); }
}`,
    tags: ["stack", "design"] }),

  Q({ id: next(), topic: "coding-challenges", topicLabel: "Coding Challenges", subtopic: "Hashing", difficulty: "easy",
    question: "Two Sum — HashMap approach.",
    answer: "One pass: for each element, look up `target - x` in the map; if found, return indices; else put `x → i`. O(n)/O(n).",
    proTip: "If asked for indices vs values: clarify upfront. If asked for *all unique pairs*, sort + two-pointer skipping duplicates.",
    codeSnippet: `int[] twoSum(int[] a, int target) {
    Map<Integer,Integer> m = new HashMap<>();
    for (int i=0;i<a.length;i++) {
        Integer j = m.get(target - a[i]);
        if (j != null) return new int[]{j,i};
        m.put(a[i], i);
    }
    return new int[0];
}`,
    tags: ["hashing", "two-sum"] }),

  Q({ id: next(), topic: "coding-challenges", topicLabel: "Coding Challenges", subtopic: "Intervals", difficulty: "medium",
    question: "Merge overlapping intervals.",
    answer: "Sort by start. Iterate; if current overlaps with last in result (`cur.start <= last.end`), extend `last.end = max(last.end, cur.end)`; else append. O(n log n) time.",
    proTip: "Edge cases: empty input, single interval, intervals exactly touching (`[1,2],[2,3]` — usually counts as overlap; clarify).",
    codeSnippet: `int[][] merge(int[][] iv) {
    Arrays.sort(iv, Comparator.comparingInt(a -> a[0]));
    List<int[]> out = new ArrayList<>();
    for (int[] cur : iv) {
        if (!out.isEmpty() && cur[0] <= out.get(out.size()-1)[1]) {
            out.get(out.size()-1)[1] = Math.max(out.get(out.size()-1)[1], cur[1]);
        } else out.add(cur);
    }
    return out.toArray(new int[0][]);
}`,
    tags: ["intervals", "sorting"] }),

  // ============ PROJECTS (10) ============
  Q({ id: next(), topic: "projects", topicLabel: "My Projects (Resume)", subtopic: "KUWY", difficulty: "hard",
    question: "Walk me through the Banking Loan Processing system you built at KUWY.",
    answer: "End-to-end loan origination platform built as Spring Boot microservices. Flow: Customer applies via web/app → KYC service verifies (Aadhar, PAN, Vehicle RC via third-party APIs, all wrapped in Resilience4j circuit breakers + Redis cache) → Underwriting service scores creditworthiness → Loan service creates the loan → events published to Kafka trigger Disbursement (bank integration) and Notification services. MySQL per service, Redis for caching, AWS EC2 + ALB + Auto Scaling, JWT auth, Swagger docs, GitHub Actions CI/CD. Achieved 30% latency improvement via Redis caching + connection pool tuning + parallel async calls with CompletableFuture.",
    proTip: "Quantify impact: 30% latency drop, 20+ APIs, 100s of loans/day — interviewers remember numbers.",
    tags: ["project", "banking"], resumeLink: "KUWY (Software Developer Java)" }),

  Q({ id: next(), topic: "projects", topicLabel: "My Projects (Resume)", subtopic: "KUWY", difficulty: "medium",
    question: "How did you achieve 30% performance improvement at KUWY?",
    answer: "Profiled hot endpoints with Micrometer + Grafana. Wins: (1) Redis cache-aside on hot KYC/loan-product reads (cut DB hits ~60%), (2) parallel third-party calls (Aadhar + PAN + RC) via `CompletableFuture.allOf` instead of sequential, (3) HikariCP pool sized correctly (was bottleneck under load), (4) JOIN FETCH / EntityGraph removed N+1 queries on listing endpoints, (5) Resilience4j circuit breakers prevented thread starvation when third-parties slowed down. Combined p95 of critical flow dropped ~30%.",
    proTip: "Always say *how you measured* — 'before vs after p95 in Grafana' is much stronger than 'feels faster'.",
    tags: ["project", "performance"], resumeLink: "KUWY 30% performance" }),

  Q({ id: next(), topic: "projects", topicLabel: "My Projects (Resume)", subtopic: "KUWY", difficulty: "hard",
    question: "Explain your microservices architecture at KUWY.",
    answer: "Bounded contexts as services: KYC, Loan Origination, Underwriting, Disbursement, Repayment, Notifications. Each owns its MySQL schema. Sync REST for queries; Kafka events (`LoanApproved`, `Disbursed`) for state changes — consumers update read models, send SMS/email, write accounting entries. API Gateway centralized JWT validation + rate limiting. Resilience4j around third-party. Redis caching. Deployed on AWS ECS behind ALB + Auto Scaling. Observability via Micrometer/Prometheus/Grafana + Sleuth/Zipkin tracing.",
    proTip: "Be ready for 'why not monolith?' — independent deploy cycles per business capability and scaling KYC separately during peak hours.",
    tags: ["project", "microservices"], resumeLink: "KUWY architecture" }),

  Q({ id: next(), topic: "projects", topicLabel: "My Projects (Resume)", subtopic: "KUWY", difficulty: "hard",
    question: "How did you handle third-party API failures (Aadhar, PAN, RC)?",
    answer: "Each external API was wrapped in a thin client with: explicit connect/read timeouts, retry with exponential backoff + jitter (max 3), Resilience4j Circuit Breaker (open after 50% failures over 20 calls, half-open probes after 30s), Redis cache for last-known-good responses, structured logging with traceId, and a typed exception hierarchy. On breaker-open we returned cached/last-known-good data and queued an async re-verification job. Bulkhead isolation prevented one slow provider from exhausting the shared thread pool.",
    proTip: "Cite SLA-aware design: 'we treated third-party APIs as unreliable from day one — the system degrades, never crashes'.",
    tags: ["resilience", "project"], resumeLink: "KUWY Aadhar/PAN integration" }),

  Q({ id: next(), topic: "projects", topicLabel: "My Projects (Resume)", subtopic: "BarathAI", difficulty: "hard",
    question: "How does your WebSocket implementation handle 100+ concurrent users in BarathAI?",
    answer: "Spring Boot WebSocket + STOMP endpoint authenticated via JWT in the CONNECT frame (`ChannelInterceptor`). Undertow IO threads tuned, OS file descriptors raised. Behind ALB with WebSocket support. Per-user destinations (`/user/queue/messages`) for direct messages, `/topic/room.{id}` for rooms. Messages persisted to MongoDB asynchronously (non-blocking write), then broadcast. Heartbeats every 25s + auto-reconnect with exponential backoff on the React client. Optimistic UI with client-side `tempId` for idempotent reconciliation. Successfully sustained 100+ concurrent connections in load tests.",
    proTip: "For '500+ users?' answer: external broker (RabbitMQ STOMP) for fan-out across nodes + sticky sessions on ALB.",
    tags: ["websocket", "project"], resumeLink: "BarathAI Chat 100+ users" }),

  Q({ id: next(), topic: "projects", topicLabel: "My Projects (Resume)", subtopic: "BarathAI", difficulty: "medium",
    question: "Explain your JWT authentication flow in BarathAI.",
    answer: "On login: validate credentials with bcrypt → issue short-lived access token (15 min, HS256) + long-lived refresh token (7 days) stored in httpOnly Secure SameSite cookie. Access token sent as `Authorization: Bearer …`. Custom `JwtAuthFilter` (registered before `UsernamePasswordAuthenticationFilter`) validates signature + expiry, extracts user, sets `SecurityContext`. On 401, the React client hits `/auth/refresh` to rotate, then retries the original request. Refresh tokens tracked server-side for revocation on logout / password change.",
    proTip: "Mention rotation + reuse detection — if a refresh token is used twice, revoke the whole family (compromise indicator).",
    tags: ["jwt", "project"], resumeLink: "BarathAI auth" }),

  Q({ id: next(), topic: "projects", topicLabel: "My Projects (Resume)", subtopic: "BarathAI", difficulty: "hard",
    question: "How did you reduce database query time by 40% in BarathAI?",
    answer: "EXPLAIN ANALYZE on slow endpoints. Wins: (1) composite index `(conversation_id, created_at DESC)` for message pagination, (2) projections instead of `SELECT *`, (3) **cursor-based pagination** instead of OFFSET (OFFSET gets slower the deeper you go), (4) batched user lookups via `IN (...)` to kill N+1, (5) Redis cache-aside for active conversation metadata, (6) HikariCP pool tuned. Combined p95 dropped ~40%.",
    proTip: "Cursor pagination is the single biggest win for chat-style histories — cite it specifically.",
    tags: ["sql", "project"], resumeLink: "BarathAI 40% query improvement" }),

  Q({ id: next(), topic: "projects", topicLabel: "My Projects (Resume)", subtopic: "AI English Tutor", difficulty: "medium",
    question: "How does the Web Speech API work in your AI English Tutor app?",
    answer: "Two browser APIs: **SpeechRecognition** (speech-to-text) — start a recognition session, receive interim + final transcripts via events; configure language, continuous mode. **SpeechSynthesis** (text-to-speech) — `speechSynthesis.speak(new SpeechSynthesisUtterance(text))` with chosen voice/rate/pitch. App flow: user speaks → STT transcript → backend evaluates pronunciation/grammar → response spoken back via TTS. Handle browser-support fallbacks (Chrome works best) and permission errors.",
    proTip: "Mention privacy: speech is processed by the browser/cloud — call it out and offer a fully on-device fallback for sensitive deployments.",
    codeSnippet: `const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
rec.lang = 'en-US'; rec.interimResults = true;
rec.onresult = e => {
    const text = Array.from(e.results).map(r => r[0].transcript).join('');
    setTranscript(text);
};
rec.start();`,
    tags: ["web-speech", "project"], resumeLink: "AI English Tutor" }),

  Q({ id: next(), topic: "projects", topicLabel: "My Projects (Resume)", subtopic: "AI English Tutor", difficulty: "medium",
    question: "How did you handle offline capabilities with IndexedDB?",
    answer: "**IndexedDB** — async, transactional, browser-based DB for large structured data (lessons, audio blobs, user progress). Wrapped via `idb` library for promise-friendly API. Strategy: cache lessons + media on first load, queue user submissions while offline, sync to backend when `navigator.onLine` returns true (also listen to `online` event). Combined with a **Service Worker** (Workbox) that intercepts fetches: cache-first for static lessons, network-first with fallback for dynamic content.",
    proTip: "Distinguish IndexedDB (large structured) from localStorage (5MB sync key-value) — interviewers test this.",
    tags: ["indexeddb", "pwa"], resumeLink: "AI English Tutor offline" }),

  Q({ id: next(), topic: "projects", topicLabel: "My Projects (Resume)", subtopic: "Behavioral", difficulty: "medium",
    question: "Tell me about a difficult bug you fixed in production.",
    answer: "At KUWY, we saw intermittent 504s on the loan submission endpoint during peak hours. Logs showed Hikari connection acquisition timeouts. Root cause: a third-party Aadhar API was responding slowly (~10s), and we held the DB connection open across that call inside a single `@Transactional` method — exhausting the pool under load. Fix: split the transaction (verify outside the DB tx), added a Resilience4j timeout + circuit breaker around the Aadhar call, and reduced HikariCP `connectionTimeout` so failures surfaced fast. 504s went to zero and p95 dropped 35%.",
    proTip: "Use STAR (Situation, Task, Action, Result) and quantify the result. Bonus: mention what monitoring you added so it never recurs.",
    tags: ["behavioral", "debugging"], resumeLink: "KUWY production debugging" }),
];

export const totalQuestions = questions.length;
