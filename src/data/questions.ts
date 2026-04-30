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
}

export interface Topic {
  id: string;
  label: string;
  description: string;
  icon: string; // lucide icon name
  accent: string; // tailwind color class
}

export const topics: Topic[] = [
  { id: "core-java", label: "Core Java Fundamentals", description: "OOP, memory, strings, equality, modifiers", icon: "Coffee", accent: "from-orange-500 to-amber-500" },
  { id: "data-structures", label: "Data Structures in Java", description: "Arrays, lists, trees, graphs, heaps, tries", icon: "Network", accent: "from-blue-500 to-cyan-500" },
  { id: "collections", label: "Collections Framework", description: "ArrayList, HashMap, ConcurrentHashMap, iterators", icon: "Layers", accent: "from-emerald-500 to-teal-500" },
  { id: "concurrency", label: "Multithreading & Concurrency", description: "Threads, locks, executors, futures, deadlocks", icon: "Cpu", accent: "from-rose-500 to-pink-500" },
  { id: "java8", label: "Java 8+ Features", description: "Lambdas, streams, Optional, method references", icon: "Sparkles", accent: "from-violet-500 to-purple-500" },
  { id: "exceptions-jvm", label: "Exception Handling & JVM", description: "Checked/unchecked, JVM internals, class loading", icon: "ShieldAlert", accent: "from-yellow-500 to-orange-500" },
  { id: "design-patterns", label: "Design Patterns & SOLID", description: "Singleton, Factory, Builder, SOLID principles", icon: "Boxes", accent: "from-indigo-500 to-blue-500" },
  { id: "spring", label: "Spring Framework", description: "Spring Boot, DI, AOP, REST, Security", icon: "Leaf", accent: "from-green-500 to-lime-500" },
  { id: "coding-challenges", label: "Coding Challenges", description: "Reverse list, LRU cache, min stack, traversals", icon: "Code2", accent: "from-fuchsia-500 to-pink-500" },
];

export const questions: Question[] = [
  // ============ CORE JAVA (10) ============
  {
    id: 1, topic: "core-java", topicLabel: "Core Java Fundamentals", subtopic: "OOP Concepts", difficulty: "easy",
    question: "What is the difference between abstraction and encapsulation?",
    answer: "Abstraction hides *implementation complexity* and exposes only essential behavior — achieved via abstract classes and interfaces. Encapsulation wraps data and the methods that operate on it into a single unit (a class) and restricts direct access using access modifiers (private, protected, public). Abstraction answers 'what an object does'; encapsulation answers 'how its state is protected'.",
    proTip: "A common follow-up: 'Can you have abstraction without encapsulation?' Technically yes, but in practice they complement each other — abstraction relies on encapsulation to hide internal state.",
    codeSnippet: `// Abstraction
abstract class Payment {
    abstract void pay(double amount); // what to do
}

// Encapsulation
class Account {
    private double balance;            // hidden state
    public void deposit(double amt) {  // controlled access
        if (amt > 0) balance += amt;
    }
    public double getBalance() { return balance; }
}`,
    tags: ["oop", "abstraction", "encapsulation"]
  },
  {
    id: 2, topic: "core-java", topicLabel: "Core Java Fundamentals", subtopic: "OOP Concepts", difficulty: "medium",
    question: "Explain the four pillars of OOP with Java examples.",
    answer: "1) **Encapsulation** — bundling data and behavior, restricting access via modifiers. 2) **Inheritance** — a subclass acquires fields/methods of a superclass using `extends`, enabling code reuse. 3) **Polymorphism** — same interface, different behavior; compile-time (overloading) and runtime (overriding via dynamic dispatch). 4) **Abstraction** — exposing only essential features through abstract classes/interfaces.",
    proTip: "Interviewers often ask 'difference between overloading and overriding' as a follow-up — overloading is resolved at compile time by signature; overriding is resolved at runtime by the actual object type.",
    codeSnippet: `class Animal {
    void sound() { System.out.println("generic sound"); }
}
class Dog extends Animal {           // Inheritance
    @Override void sound() { System.out.println("Woof"); } // Polymorphism
}
Animal a = new Dog();
a.sound(); // "Woof" — runtime dispatch`,
    tags: ["oop", "inheritance", "polymorphism"]
  },
  {
    id: 3, topic: "core-java", topicLabel: "Core Java Fundamentals", subtopic: "Memory Model", difficulty: "medium",
    question: "What is the difference between stack and heap memory in Java?",
    answer: "**Stack** stores method frames, local variables, and references — it is thread-local, LIFO-ordered, and small/fast. Each thread has its own stack. **Heap** stores all objects and class instances — it is shared across threads, larger, and managed by the garbage collector. References live on the stack; objects live on the heap. A `StackOverflowError` indicates stack exhaustion (often deep recursion); `OutOfMemoryError: Java heap space` indicates heap exhaustion.",
    proTip: "Mention escape analysis — the JIT can sometimes allocate short-lived objects on the stack to avoid GC pressure. This impresses interviewers.",
    codeSnippet: `void demo() {
    int x = 10;                    // x on stack
    String s = new String("hi");   // s ref on stack, object on heap
}`,
    tags: ["memory", "stack", "heap", "jvm"]
  },
  {
    id: 4, topic: "core-java", topicLabel: "Core Java Fundamentals", subtopic: "Garbage Collection", difficulty: "medium",
    question: "How does Java's garbage collector work? Explain generational GC.",
    answer: "Java uses **generational GC** based on the weak generational hypothesis (most objects die young). The heap is split into: **Young Generation** (Eden + two Survivor spaces S0/S1) — minor GC happens here frequently and is fast. **Old Generation** — long-lived objects promoted from young; collected by major/full GC, which is slower. **Metaspace** holds class metadata. Common collectors: Serial, Parallel, CMS (deprecated), G1 (default since Java 9), ZGC and Shenandoah (low-latency).",
    proTip: "Know that `System.gc()` is only a *hint* — the JVM may ignore it. Tuning flags like `-Xms`, `-Xmx`, `-XX:+UseG1GC` are great to mention.",
    tags: ["gc", "memory", "jvm"]
  },
  {
    id: 5, topic: "core-java", topicLabel: "Core Java Fundamentals", subtopic: "Strings", difficulty: "easy",
    question: "Why are Strings immutable in Java?",
    answer: "Strings are immutable for: **1) Security** — used in classloading, file paths, network connections; mutation could be exploited. **2) String pool / interning** — multiple references can safely share one object. **3) Thread safety** — immutable objects are inherently thread-safe. **4) Caching hashCode** — since content never changes, the hash is computed once and cached, making `String` ideal as a `HashMap` key. The `String` class is `final`, and the underlying `char[]`/`byte[]` field is `private final`.",
    proTip: "Follow-up: 'How would you create a mutable string?' → Use `StringBuilder` (single-threaded) or `StringBuffer` (synchronized).",
    codeSnippet: `String a = "java";
String b = "java";
System.out.println(a == b); // true — same pooled instance
String c = new String("java");
System.out.println(a == c);        // false — heap object
System.out.println(a == c.intern()); // true`,
    tags: ["string", "immutability", "string-pool"]
  },
  {
    id: 6, topic: "core-java", topicLabel: "Core Java Fundamentals", subtopic: "Strings", difficulty: "easy",
    question: "What is the difference between StringBuilder and StringBuffer?",
    answer: "Both are mutable character sequences. **StringBuffer** (Java 1.0) is synchronized — every method is thread-safe but slower. **StringBuilder** (Java 1.5) is not synchronized — faster, preferred for single-threaded code (e.g., inside a method). Both have the same API: `append`, `insert`, `delete`, `reverse`. Default capacity is 16; capacity grows as `(old * 2) + 2`.",
    proTip: "In modern code, **always prefer StringBuilder unless you genuinely share the buffer across threads** — and even then, prefer external synchronization or immutability over `StringBuffer`.",
    codeSnippet: `StringBuilder sb = new StringBuilder();
for (int i = 0; i < 5; i++) sb.append(i).append(",");
System.out.println(sb); // 0,1,2,3,4,`,
    tags: ["string", "stringbuilder", "stringbuffer"]
  },
  {
    id: 7, topic: "core-java", topicLabel: "Core Java Fundamentals", subtopic: "Equality", difficulty: "easy",
    question: "What is the difference between == and .equals() in Java?",
    answer: "`==` compares **references** (memory addresses) for objects and **values** for primitives. `.equals()` is a method defined in `Object` that by default also compares references, but is **overridden** in classes like `String`, `Integer`, and collections to compare *content/value*. Always use `.equals()` for content comparison and `==` only for primitives or reference identity checks (e.g., `obj == null`).",
    proTip: "Use `Objects.equals(a, b)` — it null-safely handles both sides. Also remember the autoboxing trap: `Integer` cache is only -128..127, so `Integer.valueOf(200) == Integer.valueOf(200)` is `false`.",
    codeSnippet: `String a = new String("hi");
String b = new String("hi");
System.out.println(a == b);      // false
System.out.println(a.equals(b)); // true
System.out.println(Objects.equals(null, null)); // true`,
    tags: ["equals", "equality", "hashcode"]
  },
  {
    id: 8, topic: "core-java", topicLabel: "Core Java Fundamentals", subtopic: "Equality", difficulty: "medium",
    question: "Explain the equals() and hashCode() contract.",
    answer: "Contract: **(1)** If `a.equals(b)` is true, then `a.hashCode() == b.hashCode()` MUST be true. **(2)** If hash codes are equal, equals may still be false (collision allowed). **(3)** equals must be reflexive, symmetric, transitive, and consistent. **(4)** `x.equals(null)` must be false. Violating this breaks `HashMap`, `HashSet`, `Hashtable` — equal objects placed in different buckets become 'lost'. Always override both together.",
    proTip: "Use IDE generation or `Objects.hash(field1, field2)` and `Objects.equals()` for safe implementations. For Java 14+ records, both are auto-generated.",
    codeSnippet: `class User {
    private final String email;
    public User(String e) { this.email = e; }
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User u)) return false;
        return Objects.equals(email, u.email);
    }
    @Override public int hashCode() { return Objects.hash(email); }
}`,
    tags: ["equals", "hashcode", "contract"]
  },
  {
    id: 9, topic: "core-java", topicLabel: "Core Java Fundamentals", subtopic: "Modifiers", difficulty: "easy",
    question: "Explain the access modifiers in Java.",
    answer: "**public** — accessible from anywhere. **protected** — accessible within the same package and by subclasses (even in different packages). **default / package-private** (no modifier) — accessible only within the same package. **private** — accessible only within the declaring class. From most to least restrictive: `private < default < protected < public`. Encapsulation best practice: keep fields `private` and expose them via methods.",
    proTip: "Top-level classes can only be `public` or package-private — never `private` or `protected`. Inner classes can use any modifier.",
    tags: ["modifiers", "encapsulation"]
  },
  {
    id: 10, topic: "core-java", topicLabel: "Core Java Fundamentals", subtopic: "Modifiers", difficulty: "medium",
    question: "What is the difference between final, finally, and finalize?",
    answer: "**final** — keyword: a `final` variable can't be reassigned, a `final` method can't be overridden, a `final` class can't be extended. **finally** — block: always executes after try/catch (even on return or exception), used for cleanup like closing streams. **finalize()** — deprecated method (since Java 9, removed in Java 18) called by GC before reclaiming an object — unreliable timing, never rely on it. Use `try-with-resources` or explicit cleanup instead.",
    proTip: "Mention that `finally` does NOT run if the JVM exits via `System.exit()` or the thread is killed — a great gotcha to bring up.",
    codeSnippet: `final int MAX = 100;             // final variable
try {
    risky();
} finally {
    cleanup();                   // always runs
}`,
    tags: ["final", "finally", "finalize"]
  },

  // ============ DATA STRUCTURES (28) ============
  // -- Arrays & Strings (4)
  {
    id: 11, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Arrays & Strings", difficulty: "easy",
    question: "How do you rotate an array by k positions to the right?",
    answer: "The optimal in-place O(n) time, O(1) space approach uses **three reversals**: (1) reverse the whole array, (2) reverse the first k elements, (3) reverse the remaining n-k elements. Always normalize `k = k % n` to handle k larger than length.",
    proTip: "If asked for left rotation, the same trick works — just rotate by `n - k` to the right, or reverse the first k, then the rest, then the whole.",
    codeSnippet: `void rotate(int[] a, int k) {
    int n = a.length; k %= n;
    reverse(a, 0, n - 1);
    reverse(a, 0, k - 1);
    reverse(a, k, n - 1);
}
void reverse(int[] a, int i, int j) {
    while (i < j) { int t = a[i]; a[i++] = a[j]; a[j--] = t; }
}`,
    tags: ["array", "rotation", "two-pointer"]
  },
  {
    id: 12, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Arrays & Strings", difficulty: "easy",
    question: "Explain the two-pointer technique with an example.",
    answer: "Two pointers traverse the data structure from different positions (both ends, or fast/slow) to reduce time complexity from O(n²) to O(n). Common patterns: (1) **Opposite ends** — pair sum in sorted array, palindrome check. (2) **Fast/slow** — cycle detection, middle of list. (3) **Sliding window** — variable-size subarrays. It works best on sorted or contiguous data.",
    proTip: "Always state the invariant your pointers maintain — e.g., 'left points to a candidate smallest element, right to a candidate largest'. Interviewers love clear reasoning.",
    codeSnippet: `// Pair sum in sorted array
boolean hasPair(int[] a, int target) {
    int l = 0, r = a.length - 1;
    while (l < r) {
        int s = a[l] + a[r];
        if (s == target) return true;
        if (s < target) l++; else r--;
    }
    return false;
}`,
    tags: ["array", "two-pointer", "technique"]
  },
  {
    id: 13, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Arrays & Strings", difficulty: "easy",
    question: "How do you check if two strings are anagrams?",
    answer: "Two strings are anagrams if they contain the same characters with the same frequency. **Approach 1 (sort)**: O(n log n) — sort both and compare. **Approach 2 (counting)**: O(n) — use an int[26] frequency array (for lowercase letters) or a HashMap; increment for one string, decrement for the other; all counts must end at 0.",
    proTip: "Always ask the interviewer about charset (ASCII vs Unicode) and case sensitivity — it shows attention to constraints.",
    codeSnippet: `boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] count = new int[26];
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++;
        count[t.charAt(i) - 'a']--;
    }
    for (int c : count) if (c != 0) return false;
    return true;
}`,
    tags: ["string", "anagram", "hashing"]
  },
  {
    id: 14, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Arrays & Strings", difficulty: "medium",
    question: "Find the maximum subarray sum (Kadane's algorithm).",
    answer: "**Kadane's algorithm** computes the max contiguous subarray sum in O(n) time, O(1) space. Maintain `currentMax` (best sum ending at current index) and `globalMax`. At each index: `currentMax = max(a[i], currentMax + a[i])` — either start fresh at i, or extend the previous subarray. Update `globalMax` accordingly.",
    proTip: "If the interviewer asks for the actual subarray (not just sum), track start/end indices: reset `start = i` whenever you start fresh.",
    codeSnippet: `int maxSubArray(int[] a) {
    int curr = a[0], best = a[0];
    for (int i = 1; i < a.length; i++) {
        curr = Math.max(a[i], curr + a[i]);
        best = Math.max(best, curr);
    }
    return best;
}`,
    tags: ["array", "kadane", "dp"]
  },

  // -- Linked Lists (4)
  {
    id: 15, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Linked Lists", difficulty: "easy",
    question: "How do you reverse a singly linked list iteratively?",
    answer: "Use three pointers: `prev = null`, `curr = head`, `next`. At each step, save `curr.next`, point `curr.next` to `prev`, advance `prev = curr`, then `curr = next`. When done, `prev` is the new head. Time O(n), space O(1).",
    proTip: "Recursive version is elegant but uses O(n) stack: `ListNode rev(ListNode h){ if(h==null||h.next==null) return h; ListNode r=rev(h.next); h.next.next=h; h.next=null; return r; }`",
    codeSnippet: `ListNode reverse(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    tags: ["linked-list", "reverse"]
  },
  {
    id: 16, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Linked Lists", difficulty: "medium",
    question: "How do you detect a cycle in a linked list (Floyd's algorithm)?",
    answer: "Floyd's tortoise-and-hare: use a `slow` pointer (1 step) and `fast` pointer (2 steps). If they ever meet, there's a cycle. If `fast` reaches null, no cycle. To find the cycle's *start*: after they meet, reset `slow` to head; move both one step at a time — they meet at the cycle entry. Time O(n), space O(1).",
    proTip: "Alternative is HashSet of visited nodes (O(n) space). Always mention both, then justify Floyd's for O(1) space.",
    codeSnippet: `boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
    tags: ["linked-list", "floyd", "cycle"]
  },
  {
    id: 17, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Linked Lists", difficulty: "easy",
    question: "How do you merge two sorted linked lists?",
    answer: "Use a dummy node to simplify edge cases. Maintain a `tail` pointer; at each step, attach the smaller of `l1`/`l2` and advance. After the loop, attach whatever remains. Return `dummy.next`. Time O(n+m), space O(1).",
    proTip: "Mention the recursive version too — short and elegant: `if(l1==null)return l2; if(l2==null)return l1; if(l1.val<l2.val){l1.next=merge(l1.next,l2); return l1;} else {l2.next=merge(l1,l2.next); return l2;}`",
    codeSnippet: `ListNode merge(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0), tail = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
        else { tail.next = l2; l2 = l2.next; }
        tail = tail.next;
    }
    tail.next = (l1 != null) ? l1 : l2;
    return dummy.next;
}`,
    tags: ["linked-list", "merge", "sorting"]
  },
  {
    id: 18, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Linked Lists", difficulty: "medium",
    question: "Find the middle of a linked list in one pass.",
    answer: "Use the **fast/slow pointer** technique. Move `fast` two steps, `slow` one step. When `fast` reaches the end, `slow` is at the middle. For even length, this returns the second middle (e.g., 1→2→3→4 returns 3). To get the first middle, use `while(fast.next!=null && fast.next.next!=null)`.",
    proTip: "Clarify with the interviewer which middle they want for even-length lists — this attention to detail is impressive.",
    codeSnippet: `ListNode middle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`,
    tags: ["linked-list", "two-pointer"]
  },

  // -- Stacks & Queues (3)
  {
    id: 19, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Stacks & Queues", difficulty: "medium",
    question: "How do you implement a stack using two queues?",
    answer: "Two approaches. **Push-costly**: use q1; on push, enqueue x into q2, drain q1 into q2, swap names. Push O(n), pop O(1). **Pop-costly**: push directly to q1; on pop, move all but the last from q1 to q2, return the last, swap. Push O(1), pop O(n). The push-costly version keeps the newest on top of q1 for O(1) pop/peek.",
    proTip: "Mention that with a single queue you can also do it: on push, enqueue x then rotate the queue (size-1) times so x moves to the front.",
    codeSnippet: `class StackUsingQueues {
    Queue<Integer> q1 = new LinkedList<>(), q2 = new LinkedList<>();
    public void push(int x) {
        q2.offer(x);
        while (!q1.isEmpty()) q2.offer(q1.poll());
        Queue<Integer> tmp = q1; q1 = q2; q2 = tmp;
    }
    public int pop() { return q1.poll(); }
    public int top() { return q1.peek(); }
}`,
    tags: ["stack", "queue", "design"]
  },
  {
    id: 20, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Stacks & Queues", difficulty: "easy",
    question: "How do you check for valid parentheses?",
    answer: "Use a stack. Iterate through the string: push opening brackets `(`, `[`, `{`. For closing brackets, the stack must be non-empty AND the top must match. At the end, the stack must be empty. Time O(n), space O(n). Use a map or switch to pair openers with closers.",
    proTip: "Use Deque (`ArrayDeque`) instead of `Stack` — `Stack` extends `Vector` and is synchronized/legacy. `ArrayDeque` is faster.",
    codeSnippet: `boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(') st.push(')');
        else if (c == '[') st.push(']');
        else if (c == '{') st.push('}');
        else if (st.isEmpty() || st.pop() != c) return false;
    }
    return st.isEmpty();
}`,
    tags: ["stack", "parentheses"]
  },
  {
    id: 21, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Stacks & Queues", difficulty: "medium",
    question: "Design a Min Stack supporting getMin() in O(1).",
    answer: "Maintain a second stack that tracks the running minimum. On `push(x)`: push x to the main stack; push `min(x, minStack.peek())` to the min stack (or x if empty). On `pop`: pop from both. `getMin()` returns `minStack.peek()`. All operations are O(1) time, O(n) space. A space-optimized variant pushes to minStack only when a new min appears.",
    proTip: "Truly space-optimized version: encode the difference between the pushed value and the current min on a single stack — but the two-stack version is easier to explain in interviews.",
    codeSnippet: `class MinStack {
    Deque<Integer> st = new ArrayDeque<>(), min = new ArrayDeque<>();
    public void push(int x) {
        st.push(x);
        min.push(min.isEmpty() ? x : Math.min(x, min.peek()));
    }
    public void pop()    { st.pop(); min.pop(); }
    public int top()     { return st.peek(); }
    public int getMin()  { return min.peek(); }
}`,
    tags: ["stack", "design", "min-stack"]
  },

  // -- Trees & BST (5)
  {
    id: 22, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Trees & BST", difficulty: "easy",
    question: "Explain inorder, preorder, and postorder tree traversals.",
    answer: "All three are DFS traversals on binary trees. **Preorder**: root → left → right (used for tree copying/serialization). **Inorder**: left → root → right (on a BST, returns values in sorted order). **Postorder**: left → right → root (used for deletion / dependency resolution / expression evaluation). Each is O(n) time and O(h) space (h = tree height) for the recursion stack.",
    proTip: "Be ready to write the iterative inorder using an explicit stack — it's a classic interview ask.",
    codeSnippet: `void inorder(TreeNode n) {
    if (n == null) return;
    inorder(n.left);
    System.out.println(n.val);
    inorder(n.right);
}
// Iterative inorder
void inorderIter(TreeNode root) {
    Deque<TreeNode> st = new ArrayDeque<>();
    TreeNode c = root;
    while (c != null || !st.isEmpty()) {
        while (c != null) { st.push(c); c = c.left; }
        c = st.pop();
        System.out.println(c.val);
        c = c.right;
    }
}`,
    tags: ["tree", "traversal", "dfs"]
  },
  {
    id: 23, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Trees & BST", difficulty: "easy",
    question: "How do you find the height of a binary tree?",
    answer: "Recursively: `height(node) = 0` if null, else `1 + max(height(left), height(right))`. Some define height of a single node as 0 instead of 1 — clarify with the interviewer. Time O(n), space O(h) for recursion. An iterative BFS approach increments a counter per level.",
    proTip: "Distinguish **height** (longest path down to a leaf) from **depth** (distance from root). The height of an empty tree is conventionally -1 or 0 — be explicit.",
    codeSnippet: `int height(TreeNode n) {
    if (n == null) return 0;
    return 1 + Math.max(height(n.left), height(n.right));
}`,
    tags: ["tree", "height", "recursion"]
  },
  {
    id: 24, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Trees & BST", difficulty: "medium",
    question: "How do you find the Lowest Common Ancestor (LCA) in a binary tree?",
    answer: "**General binary tree**: recurse left and right. If a subtree contains either p or q, return that node; if both subtrees return non-null, current node is the LCA. Time O(n). **For a BST**: walk down — if both p and q are smaller, go left; if both larger, go right; otherwise current node splits them and is the LCA. Time O(h).",
    proTip: "If the interviewer asks for parent pointers available, you can find LCA by walking up from both nodes and finding the first common ancestor (HashSet approach).",
    codeSnippet: `// Generic binary tree LCA
TreeNode lca(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode L = lca(root.left, p, q);
    TreeNode R = lca(root.right, p, q);
    if (L != null && R != null) return root;
    return L != null ? L : R;
}`,
    tags: ["tree", "lca", "bst"]
  },
  {
    id: 25, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Trees & BST", difficulty: "medium",
    question: "How do you validate a Binary Search Tree?",
    answer: "Each node must be greater than all values in its left subtree and less than all values in its right subtree. Recurse passing **min/max bounds**: left child must be in (min, node.val), right child in (node.val, max). The naive check (`node.val > left.val && node.val < right.val`) is wrong because it doesn't enforce the *global* property. Time O(n), space O(h).",
    proTip: "An elegant alternative: do an inorder traversal — for a valid BST, the values must be strictly increasing.",
    codeSnippet: `boolean isBST(TreeNode n, Long min, Long max) {
    if (n == null) return true;
    if (n.val <= min || n.val >= max) return false;
    return isBST(n.left, min, (long) n.val) &&
           isBST(n.right, (long) n.val, max);
}
// Call: isBST(root, Long.MIN_VALUE, Long.MAX_VALUE)`,
    tags: ["bst", "validation", "tree"]
  },
  {
    id: 26, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Trees & BST", difficulty: "medium",
    question: "How do you perform level-order traversal of a binary tree?",
    answer: "Use BFS with a queue. Offer the root, then loop while the queue is not empty: for each node, poll, process, and offer its non-null children. To group results by level, capture `queue.size()` at the start of each outer loop and process exactly that many nodes per level. Time O(n), space O(w) where w is the max width.",
    proTip: "Common follow-ups: zigzag order (alternate left-to-right per level using a deque), right-side view (last node per level), or bottom-up level order.",
    codeSnippet: `List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int sz = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < sz; i++) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left != null)  q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        res.add(level);
    }
    return res;
}`,
    tags: ["tree", "bfs", "level-order"]
  },

  // -- Heaps (3)
  {
    id: 27, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Heaps", difficulty: "easy",
    question: "What is the difference between a min-heap and a max-heap?",
    answer: "Both are complete binary trees stored as arrays. In a **min-heap**, every parent ≤ its children — the smallest element is at the root. In a **max-heap**, every parent ≥ its children — the largest element is at the root. Insertion and removal are O(log n); peek is O(1). Java's `PriorityQueue` is a min-heap by default; use `Comparator.reverseOrder()` for max-heap.",
    proTip: "Mention array indexing: for a node at index i, parent = (i-1)/2, left = 2i+1, right = 2i+2. Interviewers often probe this.",
    codeSnippet: `PriorityQueue<Integer> min = new PriorityQueue<>();
PriorityQueue<Integer> max = new PriorityQueue<>(Comparator.reverseOrder());`,
    tags: ["heap", "priority-queue"]
  },
  {
    id: 28, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Heaps", difficulty: "medium",
    question: "Find the Kth largest element in an array.",
    answer: "**Min-heap of size k**: iterate, push each element; if size > k, poll. The root is the kth largest. Time O(n log k), space O(k). Best for streaming. Other approaches: **sort** O(n log n), **Quickselect** O(n) average / O(n²) worst (in-place partition like quicksort, but recurse only into one side).",
    proTip: "If the interviewer says 'streaming data', the heap approach is the only viable one — explicitly state this trade-off.",
    codeSnippet: `int kthLargest(int[] nums, int k) {
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    for (int n : nums) {
        pq.offer(n);
        if (pq.size() > k) pq.poll();
    }
    return pq.peek();
}`,
    tags: ["heap", "kth-largest", "priority-queue"]
  },
  {
    id: 29, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Heaps", difficulty: "hard",
    question: "Explain how heap sort works.",
    answer: "Heap sort works in two phases: **(1) Build a max-heap** from the input array in O(n) (using bottom-up sift-down). **(2) Repeatedly extract the max**: swap the root with the last element, reduce heap size by 1, sift-down the new root. After n-1 extractions, the array is sorted ascending. Time O(n log n) all cases; space O(1) — in-place. Not stable.",
    proTip: "Compare to quicksort: heap sort has guaranteed O(n log n) but worse cache locality — quicksort is usually faster in practice. Mention this trade-off.",
    tags: ["heap", "sorting", "algorithm"]
  },

  // -- Graphs (4)
  {
    id: 30, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Graphs", difficulty: "easy",
    question: "How do you implement BFS on a graph?",
    answer: "BFS explores level-by-level using a queue. Start: mark source visited and enqueue. Loop: poll node, process it, enqueue all unvisited neighbors and mark them visited. Time O(V + E), space O(V). Use an adjacency list for sparse graphs. BFS finds the **shortest path in unweighted graphs**.",
    proTip: "Mark nodes visited *when you enqueue them*, not when you poll them — otherwise you may enqueue the same node multiple times.",
    codeSnippet: `void bfs(Map<Integer, List<Integer>> g, int src) {
    Set<Integer> seen = new HashSet<>();
    Queue<Integer> q = new LinkedList<>();
    q.offer(src); seen.add(src);
    while (!q.isEmpty()) {
        int n = q.poll();
        System.out.println(n);
        for (int nb : g.getOrDefault(n, List.of())) {
            if (seen.add(nb)) q.offer(nb);
        }
    }
}`,
    tags: ["graph", "bfs"]
  },
  {
    id: 31, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Graphs", difficulty: "easy",
    question: "How do you implement DFS on a graph?",
    answer: "DFS goes deep before exploring siblings. **Recursive**: mark node visited, process, recurse into each unvisited neighbor. **Iterative**: use a stack instead of a queue. Time O(V + E), space O(V). DFS is used for topological sort, cycle detection, finding connected components, and path discovery.",
    proTip: "For very deep graphs, the recursive version may overflow the stack — switch to the iterative version with an explicit stack.",
    codeSnippet: `void dfs(Map<Integer, List<Integer>> g, int n, Set<Integer> seen) {
    if (!seen.add(n)) return;
    System.out.println(n);
    for (int nb : g.getOrDefault(n, List.of())) dfs(g, nb, seen);
}`,
    tags: ["graph", "dfs", "recursion"]
  },
  {
    id: 32, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Graphs", difficulty: "medium",
    question: "How do you detect a cycle in a directed graph?",
    answer: "Use DFS with **three colors / states**: WHITE (unvisited), GRAY (in current DFS path), BLACK (fully processed). If during DFS you reach a GRAY node, you found a back-edge → cycle exists. Time O(V + E). For **undirected graphs**, simpler: a cycle exists if DFS visits a node already visited that is *not* the parent.",
    proTip: "Alternative for directed graphs: Kahn's algorithm (BFS-based topological sort) — if the result has fewer nodes than V, there's a cycle.",
    codeSnippet: `boolean hasCycle(int V, List<List<Integer>> g) {
    int[] state = new int[V]; // 0=W, 1=G, 2=B
    for (int i = 0; i < V; i++)
        if (state[i] == 0 && dfs(i, g, state)) return true;
    return false;
}
boolean dfs(int u, List<List<Integer>> g, int[] s) {
    s[u] = 1;
    for (int v : g.get(u)) {
        if (s[v] == 1) return true;
        if (s[v] == 0 && dfs(v, g, s)) return true;
    }
    s[u] = 2;
    return false;
}`,
    tags: ["graph", "cycle", "dfs"]
  },
  {
    id: 33, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Graphs", difficulty: "hard",
    question: "Explain Dijkstra's shortest path algorithm.",
    answer: "Dijkstra's finds the shortest path from a source to all nodes in a graph with **non-negative edge weights**. Use a min-heap (priority queue) keyed on distance. Initialize all distances to infinity except source = 0. Pop the closest node; for each neighbor, if `dist[u] + w < dist[v]`, relax it and push (newDist, v). Time O((V+E) log V) with a binary heap, O(E + V log V) with a Fibonacci heap.",
    proTip: "Dijkstra fails with negative edges — use Bellman-Ford instead. For unweighted graphs, plain BFS gives shortest path in O(V+E).",
    codeSnippet: `int[] dijkstra(int n, List<int[]>[] g, int src) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
    pq.offer(new int[]{src, 0});
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int u = cur[0], d = cur[1];
        if (d > dist[u]) continue;
        for (int[] e : g[u]) {
            int v = e[0], w = e[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{v, dist[v]});
            }
        }
    }
    return dist;
}`,
    tags: ["graph", "dijkstra", "shortest-path"]
  },

  // -- Hashing (3)
  {
    id: 34, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Hashing", difficulty: "hard",
    question: "How would you design your own HashMap?",
    answer: "An array of buckets indexed by `hash(key) & (capacity - 1)` (capacity is a power of 2). Each bucket is a linked list (or tree once it grows past a threshold, like Java's 8). On `put`: compute index, walk the chain — if key found update, else append. On `get`: walk the chain comparing with `.equals()`. **Resize** when `size / capacity > loadFactor` (default 0.75): allocate 2× array and rehash all entries. Average O(1), worst O(n) (or O(log n) with treeify).",
    proTip: "Mention thread safety: your custom HashMap is not thread-safe. For concurrent use, design with bucket-level locks (segments) like ConcurrentHashMap.",
    codeSnippet: `class MyHashMap<K, V> {
    static class Node<K, V> { K k; V v; Node<K, V> next; Node(K k, V v){ this.k=k; this.v=v; } }
    Node<K, V>[] buckets = new Node[16];
    int size = 0;
    int idx(K k) { return (k.hashCode() & 0x7fffffff) % buckets.length; }
    public V get(K k) {
        for (Node<K, V> n = buckets[idx(k)]; n != null; n = n.next)
            if (n.k.equals(k)) return n.v;
        return null;
    }
    public void put(K k, V v) {
        int i = idx(k);
        for (Node<K, V> n = buckets[i]; n != null; n = n.next)
            if (n.k.equals(k)) { n.v = v; return; }
        Node<K, V> n = new Node<>(k, v); n.next = buckets[i]; buckets[i] = n; size++;
    }
}`,
    tags: ["hashmap", "design", "hashing"]
  },
  {
    id: 35, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Hashing", difficulty: "medium",
    question: "How are hash collisions handled in HashMap?",
    answer: "Java's `HashMap` uses **separate chaining**: each bucket holds a singly linked list of entries with the same index. Since Java 8, when a bucket's chain length exceeds `TREEIFY_THRESHOLD = 8` (and capacity ≥ 64), the chain converts to a **red-black tree** for O(log n) lookup; it untreeifies below 6. Other collision strategies: **open addressing** (linear/quadratic probing, double hashing) — used by `IdentityHashMap`.",
    proTip: "A poorly-distributed hashCode (e.g., always returning the same int) would otherwise turn HashMap into O(n) — treeification mitigates this DoS-style attack.",
    tags: ["hashmap", "collision", "chaining"]
  },
  {
    id: 36, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Hashing", difficulty: "easy",
    question: "Solve the Two Sum problem in O(n).",
    answer: "Use a HashMap from value → index. Iterate once: for each `nums[i]`, check whether `target - nums[i]` already exists in the map; if yes, return the pair of indices; otherwise put `nums[i] → i`. Time O(n), space O(n). The naive double-loop is O(n²).",
    proTip: "If the input is **sorted**, you can do it in O(n) time and O(1) space using two pointers — interviewers love when you ask 'is the array sorted?'",
    codeSnippet: `int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (seen.containsKey(need)) return new int[]{seen.get(need), i};
        seen.put(nums[i], i);
    }
    return new int[0];
}`,
    tags: ["hashing", "two-sum", "array"]
  },

  // -- Tries (2)
  {
    id: 37, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Tries", difficulty: "medium",
    question: "How do you implement a Trie (prefix tree)?",
    answer: "A trie is a tree where each node represents a character and each path from root spells a string. Each node holds a children map (or array of size 26 for lowercase letters) and an `isEnd` flag. **Insert**: walk/create nodes per character, mark end. **Search**: walk; return `isEnd`. **StartsWith**: walk; return true if path exists. All operations are O(L), where L is the word length.",
    proTip: "Tries shine for autocomplete, spell-check, IP routing, and longest-prefix matching — way better than HashSet for these use cases.",
    codeSnippet: `class Trie {
    static class Node { Node[] next = new Node[26]; boolean end; }
    Node root = new Node();
    public void insert(String w) {
        Node n = root;
        for (char c : w.toCharArray()) {
            int i = c - 'a';
            if (n.next[i] == null) n.next[i] = new Node();
            n = n.next[i];
        }
        n.end = true;
    }
    public boolean search(String w)     { Node n = walk(w); return n != null && n.end; }
    public boolean startsWith(String p) { return walk(p) != null; }
    private Node walk(String s) {
        Node n = root;
        for (char c : s.toCharArray()) {
            n = n.next[c - 'a'];
            if (n == null) return null;
        }
        return n;
    }
}`,
    tags: ["trie", "prefix-tree", "design"]
  },
  {
    id: 38, topic: "data-structures", topicLabel: "Data Structures in Java", subtopic: "Tries", difficulty: "hard",
    question: "How do you implement autocomplete using a Trie?",
    answer: "Insert all dictionary words. For a query: walk the trie to the node representing the prefix; if not found, return empty. From that node, perform DFS collecting all completed words (where `isEnd` is true) into a list. Optional optimization: store the top-K most frequent suggestions at each node (heavy-hitters cache) to avoid the DFS for popular prefixes.",
    proTip: "Mention real-world relevance: search engines (Google, Elasticsearch) use tries with frequency weights and edit-distance for typo tolerance.",
    codeSnippet: `List<String> autocomplete(Trie t, String prefix) {
    List<String> out = new ArrayList<>();
    Trie.Node n = t.walk(prefix);
    if (n == null) return out;
    dfs(n, new StringBuilder(prefix), out);
    return out;
}
void dfs(Trie.Node n, StringBuilder sb, List<String> out) {
    if (n.end) out.add(sb.toString());
    for (int i = 0; i < 26; i++) {
        if (n.next[i] != null) {
            sb.append((char)('a' + i));
            dfs(n.next[i], sb, out);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}`,
    tags: ["trie", "autocomplete", "dfs"]
  },

  // ============ COLLECTIONS (8) ============
  {
    id: 39, topic: "collections", topicLabel: "Collections Framework", subtopic: "List", difficulty: "easy",
    question: "What is the difference between ArrayList and LinkedList?",
    answer: "**ArrayList** is backed by a dynamic array — O(1) random access, O(1) amortized append, O(n) insertion/removal in the middle. Better cache locality. **LinkedList** is a doubly-linked list — O(1) insertion/removal at known positions (especially head/tail), O(n) random access. Higher per-element memory overhead (next/prev pointers). For most use cases, **ArrayList wins** thanks to cache friendliness — even for queue-like workloads, prefer `ArrayDeque`.",
    proTip: "If asked 'when would you use LinkedList?' — honestly, almost never in modern Java. Sometimes for `Deque` semantics, but `ArrayDeque` is faster.",
    tags: ["arraylist", "linkedlist", "collections"]
  },
  {
    id: 40, topic: "collections", topicLabel: "Collections Framework", subtopic: "Map", difficulty: "hard",
    question: "How does HashMap work internally in Java 8+?",
    answer: "HashMap uses an array of `Node<K,V>` buckets (default capacity 16). Index = `(n - 1) & hash` where `hash = key.hashCode() ^ (hashCode >>> 16)` (mix high/low bits to reduce collisions). Buckets store linked lists of entries; if a chain reaches 8 entries (and table ≥ 64), it converts to a red-black tree (O(log n) lookup). Resizing doubles the capacity at load factor 0.75 and rehashes all entries. Not thread-safe.",
    proTip: "The high-bit XOR is to handle hashCodes that vary mostly in upper bits — e.g., Float values. Mention this for senior-level points.",
    codeSnippet: `// Pseudo of internal index calculation
int hash = key.hashCode() ^ (key.hashCode() >>> 16);
int index = (table.length - 1) & hash;`,
    tags: ["hashmap", "internals", "treeify"]
  },
  {
    id: 41, topic: "collections", topicLabel: "Collections Framework", subtopic: "Map", difficulty: "hard",
    question: "How does ConcurrentHashMap differ from Hashtable and synchronized HashMap?",
    answer: "**Hashtable** synchronizes every method on the whole map → poor concurrency. **Collections.synchronizedMap(hm)** is the same coarse-grained lock. **ConcurrentHashMap** (Java 8+) uses per-bucket CAS operations and `synchronized` only on the first node of each bucket — many threads can write concurrently to different buckets. Reads are mostly lock-free. Iterators are **weakly consistent** (won't throw ConcurrentModificationException, may or may not reflect concurrent changes). Null keys/values are not allowed.",
    proTip: "Pre-Java 8 used 'segments' (fixed number of locks). Java 8 redesigned it to per-bucket — interviewers love when you mention this evolution.",
    tags: ["concurrenthashmap", "concurrency", "thread-safety"]
  },
  {
    id: 42, topic: "collections", topicLabel: "Collections Framework", subtopic: "Sorting", difficulty: "easy",
    question: "What is the difference between Comparable and Comparator?",
    answer: "**Comparable<T>** defines a class's *natural ordering* via `compareTo(T other)` — implemented inside the class itself (e.g., `String`, `Integer`). **Comparator<T>** is an external strategy via `compare(T a, T b)` — multiple comparators can sort the same class differently without modifying it. Use `Comparable` when there's one obvious order; use `Comparator` for flexibility (multi-field sort, runtime selection).",
    proTip: "Java 8 lambdas + `Comparator.comparing(...)` and `.thenComparing(...)` make multi-field sorts elegant — show this in your answer.",
    codeSnippet: `// Comparable
class Person implements Comparable<Person> {
    String name; int age;
    public int compareTo(Person o) { return this.age - o.age; }
}
// Comparator (multi-field)
list.sort(Comparator.comparing(Person::getAge)
                    .thenComparing(Person::getName));`,
    tags: ["comparable", "comparator", "sorting"]
  },
  {
    id: 43, topic: "collections", topicLabel: "Collections Framework", subtopic: "Iterators", difficulty: "medium",
    question: "What is the difference between fail-fast and fail-safe iterators?",
    answer: "**Fail-fast** iterators (most `java.util` collections like ArrayList, HashMap) check a `modCount` field; if the collection is structurally modified during iteration (except via the iterator's own `remove`), they throw `ConcurrentModificationException`. **Fail-safe** iterators (e.g., `CopyOnWriteArrayList`, `ConcurrentHashMap`) operate on a snapshot or use weakly-consistent traversal — no CME, but may not see the latest changes. Fail-safe trades visibility for safety.",
    proTip: "CME is not strictly tied to threads — modifying a collection from the same thread mid-iteration also triggers it.",
    codeSnippet: `List<Integer> list = new ArrayList<>(List.of(1, 2, 3));
for (int x : list) if (x == 2) list.remove(Integer.valueOf(x)); // throws CME
// Safe:
list.removeIf(x -> x == 2);`,
    tags: ["iterator", "fail-fast", "concurrency"]
  },
  {
    id: 44, topic: "collections", topicLabel: "Collections Framework", subtopic: "Map", difficulty: "medium",
    question: "How does TreeMap differ from HashMap and LinkedHashMap?",
    answer: "**HashMap** — unordered, O(1) average get/put. **LinkedHashMap** — preserves insertion order (or access order with a flag, useful for LRU caches), O(1) get/put with slight overhead from a doubly-linked list. **TreeMap** — backed by a red-black tree, keys sorted by natural order or supplied Comparator, O(log n) get/put, but provides navigational methods (`firstKey`, `floorKey`, `subMap`, `ceilingKey`).",
    proTip: "If you need range queries or 'closest key' lookups, TreeMap is unmatched. If you need stable iteration order without sorting cost, LinkedHashMap.",
    tags: ["treemap", "linkedhashmap", "hashmap"]
  },
  {
    id: 45, topic: "collections", topicLabel: "Collections Framework", subtopic: "Map", difficulty: "medium",
    question: "How does HashSet work internally?",
    answer: "`HashSet` is implemented as a `HashMap` where every value is a shared dummy object (`PRESENT`). All set operations delegate to the underlying map — `add(e)` calls `map.put(e, PRESENT)`, returning true only if the previous value was null. Same time complexity as HashMap: O(1) average for `add`, `contains`, `remove`. Not thread-safe.",
    proTip: "If you need a thread-safe set, use `ConcurrentHashMap.newKeySet()` or `Collections.newSetFromMap(new ConcurrentHashMap<>())`.",
    tags: ["hashset", "internals"]
  },
  {
    id: 46, topic: "collections", topicLabel: "Collections Framework", subtopic: "List", difficulty: "medium",
    question: "What is CopyOnWriteArrayList and when would you use it?",
    answer: "`CopyOnWriteArrayList` is a thread-safe `List` where every mutating operation (`add`, `set`, `remove`) creates a fresh copy of the underlying array. Reads are lock-free and very fast. Iterators operate on a snapshot, so no `ConcurrentModificationException`. Best for **read-heavy, write-rare** scenarios (e.g., listener lists, configuration). Writes are O(n) and expensive in memory — bad for write-heavy workloads.",
    proTip: "Classic use case: `EventListenerList` in Swing, or observer lists. Avoid for high-write workloads where ConcurrentLinkedQueue or other concurrent structures suit better.",
    tags: ["cow", "concurrency", "list"]
  },

  // ============ CONCURRENCY (8) ============
  {
    id: 47, topic: "concurrency", topicLabel: "Multithreading & Concurrency", subtopic: "Threads", difficulty: "easy",
    question: "Explain the lifecycle of a Java thread.",
    answer: "Six states (per `Thread.State`): **NEW** — created, not started. **RUNNABLE** — `start()` called, eligible for CPU (includes 'ready' and 'running'). **BLOCKED** — waiting for a monitor lock. **WAITING** — `wait()`, `join()` without timeout, `LockSupport.park()`. **TIMED_WAITING** — `sleep(t)`, `wait(t)`, `join(t)`. **TERMINATED** — `run()` finished or threw uncaught exception. Transitions are managed by the OS scheduler and the JVM.",
    proTip: "BLOCKED is specifically waiting for a *monitor* (synchronized) lock. WAITING includes `Lock` waits via `Condition`. Be precise — interviewers test this.",
    tags: ["thread", "lifecycle", "states"]
  },
  {
    id: 48, topic: "concurrency", topicLabel: "Multithreading & Concurrency", subtopic: "Threads", difficulty: "easy",
    question: "What is the difference between Runnable and Callable?",
    answer: "**Runnable** has `void run()` — no return value, cannot throw checked exceptions. **Callable<V>** has `V call() throws Exception` — returns a value and can throw checked exceptions. Callables are used with `ExecutorService.submit()` which returns a `Future<V>` — call `future.get()` to retrieve the result (blocks). Runnable suits fire-and-forget; Callable suits compute-then-return tasks.",
    proTip: "You can wrap a Runnable as a Callable using `Executors.callable(runnable, result)` — handy when an API requires a Callable.",
    codeSnippet: `Callable<Integer> task = () -> {
    Thread.sleep(100);
    return 42;
};
ExecutorService es = Executors.newSingleThreadExecutor();
Future<Integer> f = es.submit(task);
System.out.println(f.get()); // 42
es.shutdown();`,
    tags: ["runnable", "callable", "future"]
  },
  {
    id: 49, topic: "concurrency", topicLabel: "Multithreading & Concurrency", subtopic: "Synchronization", difficulty: "medium",
    question: "How does the synchronized keyword work?",
    answer: "`synchronized` acquires an intrinsic monitor lock on an object. **Synchronized method** locks `this` (or `Class<T>` for static methods). **Synchronized block** locks an explicit object. Only one thread can hold the monitor at a time; others block. It also establishes a **happens-before** relationship: actions before releasing the lock are visible to the next thread acquiring it (ensuring memory visibility, not just mutual exclusion).",
    proTip: "Lock the smallest scope you need — coarse locks kill performance. Use private final lock objects to avoid leaking the lock externally: `private final Object lock = new Object();`",
    codeSnippet: `class Counter {
    private int n = 0;
    private final Object lock = new Object();
    public void inc() {
        synchronized (lock) { n++; }
    }
}`,
    tags: ["synchronized", "monitor", "happens-before"]
  },
  {
    id: 50, topic: "concurrency", topicLabel: "Multithreading & Concurrency", subtopic: "Memory model", difficulty: "medium",
    question: "What is the volatile keyword and when should you use it?",
    answer: "`volatile` guarantees: **(1) Visibility** — writes are flushed to main memory, reads come from main memory; no thread sees a stale cached value. **(2) Ordering** — prevents the JIT/CPU from reordering reads/writes around the volatile access (memory barriers). It does **NOT** provide atomicity for compound actions (e.g., `n++` is still racy on a volatile int). Use it for simple flags, double-checked locking (Java 5+), or single-writer scenarios.",
    proTip: "For atomic increments use `AtomicInteger`; for richer state with compound updates use locks or `synchronized`. `volatile` is too weak for most non-trivial cases.",
    codeSnippet: `class StopFlag {
    private volatile boolean stop = false;
    public void requestStop() { stop = true; }
    public void run() {
        while (!stop) { /* work */ }
    }
}`,
    tags: ["volatile", "memory-model", "visibility"]
  },
  {
    id: 51, topic: "concurrency", topicLabel: "Multithreading & Concurrency", subtopic: "Locks", difficulty: "medium",
    question: "Compare ReentrantLock with synchronized.",
    answer: "`ReentrantLock` is an explicit lock from `java.util.concurrent.locks`. Advantages over `synchronized`: **(1) tryLock()** with timeout (avoid indefinite blocking). **(2) Interruptible** lock acquisition. **(3) Fairness** option — FIFO order of waiters. **(4) Multiple `Condition` variables** per lock. Drawback: must remember `unlock()` in a finally block — failure to do so causes leaks. `synchronized` is simpler, JVM-managed, and slightly faster in uncontended cases.",
    proTip: "Always pair lock/unlock in try/finally: `lock.lock(); try { ... } finally { lock.unlock(); }`. Forgetting this is a classic interview trap.",
    codeSnippet: `ReentrantLock lock = new ReentrantLock();
lock.lock();
try {
    // critical section
} finally {
    lock.unlock();
}`,
    tags: ["lock", "reentrantlock", "synchronized"]
  },
  {
    id: 52, topic: "concurrency", topicLabel: "Multithreading & Concurrency", subtopic: "Executors", difficulty: "medium",
    question: "What is ExecutorService and what executor types exist?",
    answer: "`ExecutorService` decouples task submission from thread management — you submit `Runnable`/`Callable`, the pool reuses threads. Common factory methods: **newFixedThreadPool(n)** — fixed pool. **newCachedThreadPool()** — grows on demand, reuses idle threads (60s timeout). **newSingleThreadExecutor()** — single worker, sequential. **newScheduledThreadPool(n)** — for delayed/periodic tasks. Java 21 adds **Executors.newVirtualThreadPerTaskExecutor()** for virtual threads. Always call `shutdown()`.",
    proTip: "Avoid `Executors.newCachedThreadPool` in production — unbounded queue/pool can exhaust resources. Prefer a tuned `ThreadPoolExecutor` directly.",
    codeSnippet: `ExecutorService es = Executors.newFixedThreadPool(4);
for (int i = 0; i < 10; i++) {
    final int id = i;
    es.submit(() -> System.out.println("Task " + id));
}
es.shutdown();
es.awaitTermination(1, TimeUnit.MINUTES);`,
    tags: ["executor", "thread-pool"]
  },
  {
    id: 53, topic: "concurrency", topicLabel: "Multithreading & Concurrency", subtopic: "Async", difficulty: "hard",
    question: "What is CompletableFuture and how does it improve over Future?",
    answer: "`CompletableFuture<T>` (Java 8) is a Future that supports **non-blocking composition**. Unlike `Future` which only has blocking `get()`, CompletableFuture provides: `thenApply` (transform), `thenCompose` (chain async), `thenCombine` (combine two), `allOf`/`anyOf` (multi-future), `exceptionally`/`handle` (error recovery). It runs callbacks on the common ForkJoinPool by default (use `*Async` overloads with a custom executor for control). Enables a fluent reactive style.",
    proTip: "Always provide an explicit executor for production use — relying on the common ForkJoinPool can cause contention with parallel streams.",
    codeSnippet: `CompletableFuture
    .supplyAsync(() -> fetchUser(id))
    .thenApply(User::getEmail)
    .thenAccept(System.out::println)
    .exceptionally(ex -> { ex.printStackTrace(); return null; });`,
    tags: ["completablefuture", "async", "future"]
  },
  {
    id: 54, topic: "concurrency", topicLabel: "Multithreading & Concurrency", subtopic: "Hazards", difficulty: "hard",
    question: "What is a deadlock and how do you prevent it?",
    answer: "A **deadlock** is when two or more threads are blocked forever, each waiting for a lock held by another. Coffman conditions: mutual exclusion, hold-and-wait, no preemption, circular wait. **Prevention**: (1) **Lock ordering** — always acquire locks in a globally consistent order. (2) **tryLock with timeout** — back off and retry on failure. (3) **Reduce lock scope** or use lock-free data structures (CAS, AtomicReference). (4) Use higher-level concurrency tools (`ConcurrentHashMap`, queues).",
    proTip: "Producer-consumer is a related classic — solve it with `BlockingQueue` (e.g., `ArrayBlockingQueue`), which handles wait/notify internally and removes the chance of bugs.",
    codeSnippet: `// Bad: inconsistent lock order can deadlock
synchronized (a) { synchronized (b) { ... } } // T1
synchronized (b) { synchronized (a) { ... } } // T2

// Good: order by identityHashCode
Object first = System.identityHashCode(a) < System.identityHashCode(b) ? a : b;
Object second = first == a ? b : a;
synchronized (first) { synchronized (second) { ... } }`,
    tags: ["deadlock", "race-condition", "concurrency"]
  },

  // ============ JAVA 8+ (6) ============
  {
    id: 55, topic: "java8", topicLabel: "Java 8+ Features", subtopic: "Lambdas", difficulty: "easy",
    question: "What is a lambda expression and a functional interface?",
    answer: "A **lambda** is a concise way to represent an anonymous function: `(params) -> expression` or `(params) -> { body }`. A **functional interface** is an interface with exactly one abstract method (SAM). The `@FunctionalInterface` annotation enforces this. Lambdas are syntactic sugar for instances of functional interfaces — the compiler infers which interface from the target type. Built-in examples: `Runnable`, `Comparator`, `Predicate`, `Function`.",
    proTip: "Lambdas can capture *effectively final* local variables. They cannot mutate captured locals — but they CAN mutate fields of captured objects.",
    codeSnippet: `Runnable r = () -> System.out.println("hi");
Comparator<String> c = (a, b) -> a.length() - b.length();
Function<Integer, Integer> sq = x -> x * x;`,
    tags: ["lambda", "functional-interface"]
  },
  {
    id: 56, topic: "java8", topicLabel: "Java 8+ Features", subtopic: "Functional Interfaces", difficulty: "easy",
    question: "Explain Predicate, Function, Consumer, and Supplier.",
    answer: "**Predicate<T>** — `boolean test(T t)`; tests a condition (e.g., `s -> s.isEmpty()`). **Function<T, R>** — `R apply(T t)`; transforms input (e.g., `String::length`). **Consumer<T>** — `void accept(T t)`; performs side effects (e.g., `System.out::println`). **Supplier<T>** — `T get()`; produces values lazily (e.g., `() -> new ArrayList<>()`). All four live in `java.util.function` and are the building blocks of streams.",
    proTip: "Mention `BiFunction`, `BiPredicate`, `BiConsumer` (two-arg variants), and primitive specializations like `IntPredicate` to avoid autoboxing in hot paths.",
    codeSnippet: `Predicate<String> nonEmpty = s -> !s.isEmpty();
Function<String, Integer> len = String::length;
Consumer<String> printer = System.out::println;
Supplier<List<String>> listSupplier = ArrayList::new;`,
    tags: ["functional", "predicate", "function"]
  },
  {
    id: 57, topic: "java8", topicLabel: "Java 8+ Features", subtopic: "Streams", difficulty: "medium",
    question: "Explain the Stream API and its main operations.",
    answer: "Streams are pipelines of operations on a sequence of elements. **Intermediate** ops are lazy and return a stream: `filter`, `map`, `flatMap`, `sorted`, `distinct`, `limit`. **Terminal** ops trigger execution: `collect`, `forEach`, `reduce`, `count`, `findFirst`, `anyMatch`. Streams may be **sequential** or **parallel** (`.parallelStream()`). They don't store data and are single-use — once consumed, they cannot be reused.",
    proTip: "Use `parallelStream()` only for CPU-bound, large, stateless workloads. For small or I/O-bound work, the overhead of fork/join hurts performance.",
    codeSnippet: `List<String> names = List.of("alice", "bob", "carol");
String joined = names.stream()
    .filter(n -> n.length() > 3)
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.joining(", "));
System.out.println(joined); // ALICE, CAROL`,
    tags: ["streams", "functional"]
  },
  {
    id: 58, topic: "java8", topicLabel: "Java 8+ Features", subtopic: "Streams", difficulty: "medium",
    question: "How does Stream.reduce() work? Give examples.",
    answer: "`reduce` combines stream elements into a single result using a binary operator. Three forms: **reduce(BinaryOperator)** returns Optional. **reduce(identity, BinaryOperator)** returns T directly. **reduce(identity, accumulator, combiner)** for parallel streams where accumulator and combiner may have different types. The operator must be associative for correct parallel results.",
    proTip: "For most aggregations, prefer `Collectors.summingInt`, `averagingDouble`, `groupingBy` etc. — they're more readable than raw reduce.",
    codeSnippet: `int sum = List.of(1, 2, 3, 4).stream().reduce(0, Integer::sum); // 10
Optional<String> longest = words.stream()
    .reduce((a, b) -> a.length() >= b.length() ? a : b);`,
    tags: ["streams", "reduce"]
  },
  {
    id: 59, topic: "java8", topicLabel: "Java 8+ Features", subtopic: "Optional", difficulty: "easy",
    question: "What is Optional and how should you use it?",
    answer: "`Optional<T>` is a container that may or may not hold a non-null value, designed to make 'might be absent' explicit in APIs and reduce NullPointerExceptions. Use `Optional.of(x)`, `Optional.ofNullable(x)`, `Optional.empty()`. Consume via `ifPresent`, `orElse`, `orElseGet`, `orElseThrow`, `map`, `flatMap`. **Best practice**: use Optional as a return type, NOT as a field, parameter, or in collections.",
    proTip: "Avoid `optional.get()` without first checking — it's the new NPE. Prefer `orElseThrow()` or `orElse(default)`.",
    codeSnippet: `Optional<User> u = repo.findById(1);
String email = u.map(User::getEmail).orElse("unknown@example.com");`,
    tags: ["optional", "null-safety"]
  },
  {
    id: 60, topic: "java8", topicLabel: "Java 8+ Features", subtopic: "Method References & Default Methods", difficulty: "easy",
    question: "What are method references and default methods?",
    answer: "**Method references** are shorthand for lambdas calling existing methods. Four kinds: `Class::staticMethod`, `instance::method`, `Class::instanceMethod` (unbound), `Class::new` (constructor). Example: `s -> s.toUpperCase()` becomes `String::toUpperCase`. **Default methods** in interfaces (Java 8+) provide a default implementation, allowing interfaces to evolve without breaking existing implementations. Use `interface Foo { default void bar() { ... } }`.",
    proTip: "Default methods enabled adding `stream()`, `forEach()`, etc. to `Collection` without breaking the world. They also resolve the diamond problem with explicit `InterfaceName.super.method()` syntax.",
    codeSnippet: `// Method reference
list.forEach(System.out::println);

// Default method in interface
interface Greeter {
    String name();
    default String greet() { return "Hello, " + name(); }
}`,
    tags: ["method-reference", "default-method"]
  },

  // ============ EXCEPTIONS & JVM (5) ============
  {
    id: 61, topic: "exceptions-jvm", topicLabel: "Exception Handling & JVM Internals", subtopic: "Exceptions", difficulty: "easy",
    question: "What is the difference between checked and unchecked exceptions?",
    answer: "**Checked exceptions** extend `Exception` (but not `RuntimeException`) — the compiler forces you to handle them with try/catch or declare via `throws` (e.g., `IOException`, `SQLException`). **Unchecked exceptions** extend `RuntimeException` — no compile-time enforcement (e.g., `NullPointerException`, `IllegalArgumentException`, `ArrayIndexOutOfBoundsException`). **Errors** (`OutOfMemoryError`, `StackOverflowError`) are unchecked and indicate JVM-level problems you typically shouldn't catch.",
    proTip: "Modern frameworks (Spring) often wrap checked exceptions in unchecked ones — checked exceptions are widely considered overused. Argue both sides if asked.",
    tags: ["exceptions", "checked", "unchecked"]
  },
  {
    id: 62, topic: "exceptions-jvm", topicLabel: "Exception Handling & JVM Internals", subtopic: "Exceptions", difficulty: "easy",
    question: "How do you create a custom exception in Java?",
    answer: "Extend `Exception` (checked) or `RuntimeException` (unchecked). Provide constructors that accept a message and/or cause, and forward to `super(...)`. Add custom fields (e.g., error code) if useful. Always preserve the cause when wrapping — never silently drop it.",
    proTip: "Prefer unchecked custom exceptions for business errors; reserve checked exceptions for recoverable I/O-style failures the caller must handle.",
    codeSnippet: `public class UserNotFoundException extends RuntimeException {
    private final long userId;
    public UserNotFoundException(long id) {
        super("User not found: " + id);
        this.userId = id;
    }
    public UserNotFoundException(long id, Throwable cause) {
        super("User not found: " + id, cause);
        this.userId = id;
    }
    public long getUserId() { return userId; }
}`,
    tags: ["custom-exception", "exceptions"]
  },
  {
    id: 63, topic: "exceptions-jvm", topicLabel: "Exception Handling & JVM Internals", subtopic: "Resources", difficulty: "medium",
    question: "What is try-with-resources and how does it differ from try-finally?",
    answer: "`try-with-resources` (Java 7+) automatically closes any resource implementing `AutoCloseable` (or `Closeable`) at the end of the block, even on exceptions. Equivalent to a `finally` calling `close()`, but without boilerplate AND it correctly handles **suppressed exceptions** — if both the body and `close()` throw, the close exception is attached via `Throwable.getSuppressed()` instead of masking the original.",
    proTip: "Multiple resources can be declared, separated by `;`. They're closed in **reverse** declaration order. Java 9+ allows referencing effectively-final variables declared outside the try.",
    codeSnippet: `try (BufferedReader br = new BufferedReader(new FileReader("a.txt"));
     PrintWriter pw = new PrintWriter("b.txt")) {
    String line;
    while ((line = br.readLine()) != null) pw.println(line);
} // both auto-closed`,
    tags: ["try-with-resources", "exceptions", "autocloseable"]
  },
  {
    id: 64, topic: "exceptions-jvm", topicLabel: "Exception Handling & JVM Internals", subtopic: "JVM", difficulty: "hard",
    question: "Explain the JVM architecture and class loading process.",
    answer: "JVM components: **ClassLoader subsystem** (loads .class files), **Runtime Data Areas** (Method Area / Metaspace, Heap, Stack per thread, PC Register, Native Method Stack), **Execution Engine** (Interpreter, JIT compiler, GC), **Native Interface (JNI)**. **Class loading**: (1) **Loading** — read .class. (2) **Linking** = Verification (bytecode safety) + Preparation (default static field values) + Resolution (symbolic refs). (3) **Initialization** — run static initializers. Loaders use **parent delegation** (Bootstrap → Platform → Application → custom).",
    proTip: "Mention that Metaspace replaced PermGen in Java 8 — it's allocated in native memory and grows dynamically, eliminating the classic `OutOfMemoryError: PermGen space`.",
    tags: ["jvm", "classloader", "architecture"]
  },
  {
    id: 65, topic: "exceptions-jvm", topicLabel: "Exception Handling & JVM Internals", subtopic: "JVM", difficulty: "medium",
    question: "What is JIT compilation and how does it improve performance?",
    answer: "The **JIT (Just-In-Time) compiler** translates frequently executed bytecode into native machine code at runtime, caching it in the code cache. The JVM starts by **interpreting** bytecode (fast startup); the JIT identifies hot methods (via invocation counters / back-edge counters) and compiles them with optimizations like inlining, escape analysis, dead-code elimination, and loop unrolling. HotSpot uses two compilers: **C1 (client)** — quick, lighter optimizations; **C2 (server)** — slower, aggressive optimizations. Tiered compilation uses both.",
    proTip: "Mention `-XX:+PrintCompilation` and JITWatch as practical tools to inspect what's getting compiled — shows hands-on familiarity.",
    tags: ["jit", "jvm", "performance"]
  },

  // ============ DESIGN PATTERNS (5) ============
  {
    id: 66, topic: "design-patterns", topicLabel: "Design Patterns & SOLID", subtopic: "Creational", difficulty: "medium",
    question: "How do you implement a thread-safe Singleton in Java?",
    answer: "Best modern approaches: **(1) Enum singleton (preferred)** — JVM guarantees a single instance, handles serialization, and is reflection-safe. **(2) Bill Pugh holder** — uses a static inner class loaded lazily on first access; thread-safe via class-loading semantics, no synchronization cost. **(3) Double-checked locking** — uses `volatile` + synchronized block; correct since Java 5 with the proper memory model. Avoid eager init if construction is expensive.",
    proTip: "Joshua Bloch's *Effective Java* recommends enum as the simplest correct singleton — quote that, interviewers love the reference.",
    codeSnippet: `// Enum (preferred)
public enum Config { INSTANCE; public void doStuff() {} }

// Bill Pugh holder
public class Singleton {
    private Singleton() {}
    private static class Holder { static final Singleton I = new Singleton(); }
    public static Singleton getInstance() { return Holder.I; }
}

// Double-checked locking
public class DCL {
    private static volatile DCL i;
    private DCL() {}
    public static DCL getInstance() {
        if (i == null) {
            synchronized (DCL.class) {
                if (i == null) i = new DCL();
            }
        }
        return i;
    }
}`,
    tags: ["singleton", "design-pattern", "thread-safety"]
  },
  {
    id: 67, topic: "design-patterns", topicLabel: "Design Patterns & SOLID", subtopic: "Creational", difficulty: "easy",
    question: "Explain the Factory pattern with a Java example.",
    answer: "The **Factory pattern** centralizes object creation, so callers depend on an interface rather than concrete classes. A static or instance method returns a product based on input. Benefits: decouples client from concrete types, supports easy extension, can cache instances or apply preprocessing. **Abstract Factory** generalizes to families of related products.",
    proTip: "Distinguish from the **Builder** pattern — Factory chooses *which* type to build; Builder constructs *complex* instances step-by-step. Common interview confusion.",
    codeSnippet: `interface Shape { void draw(); }
class Circle implements Shape { public void draw(){ System.out.println("○"); } }
class Square implements Shape { public void draw(){ System.out.println("□"); } }

class ShapeFactory {
    public static Shape create(String type) {
        return switch (type.toLowerCase()) {
            case "circle" -> new Circle();
            case "square" -> new Square();
            default -> throw new IllegalArgumentException(type);
        };
    }
}`,
    tags: ["factory", "design-pattern", "creational"]
  },
  {
    id: 68, topic: "design-patterns", topicLabel: "Design Patterns & SOLID", subtopic: "Creational", difficulty: "medium",
    question: "Explain the Builder pattern.",
    answer: "The **Builder pattern** constructs complex objects step-by-step using a fluent API, useful when there are many optional parameters or a long telescoping constructor. The Builder collects state, then `build()` returns an immutable product. Benefits: readability, immutability of the product, validation before construction, supports optional fields naturally.",
    proTip: "Mention Lombok's `@Builder` or Java 14+ records as alternatives. For records, you can define a static builder if you need optional fields.",
    codeSnippet: `public class User {
    private final String name; private final int age; private final String email;
    private User(Builder b) { this.name = b.name; this.age = b.age; this.email = b.email; }
    public static class Builder {
        private String name; private int age; private String email;
        public Builder name(String n)  { this.name = n; return this; }
        public Builder age(int a)      { this.age = a; return this; }
        public Builder email(String e) { this.email = e; return this; }
        public User build()            { return new User(this); }
    }
}
User u = new User.Builder().name("Alice").age(30).email("a@x.com").build();`,
    tags: ["builder", "design-pattern", "creational"]
  },
  {
    id: 69, topic: "design-patterns", topicLabel: "Design Patterns & SOLID", subtopic: "Behavioral", difficulty: "medium",
    question: "Explain the Observer and Strategy patterns.",
    answer: "**Observer**: a subject maintains a list of observers and notifies them of state changes. Decouples publisher from subscribers — used in event systems, listeners, reactive streams. Java provides `PropertyChangeSupport`; reactive frameworks (RxJava, Project Reactor) generalize it. **Strategy**: defines a family of interchangeable algorithms behind a common interface, swapped at runtime. Replaces conditional logic — e.g., different sorting comparators, payment methods, compression algorithms.",
    proTip: "In modern Java, both patterns often collapse into lambdas — a `Consumer<Event>` IS an observer; a `Comparator<T>` IS a strategy.",
    codeSnippet: `// Strategy via lambda
interface PricingStrategy { double price(double base); }
PricingStrategy regular = b -> b;
PricingStrategy holiday = b -> b * 0.8;
double total = holiday.price(100); // 80.0`,
    tags: ["observer", "strategy", "design-pattern"]
  },
  {
    id: 70, topic: "design-patterns", topicLabel: "Design Patterns & SOLID", subtopic: "Principles", difficulty: "medium",
    question: "Explain the SOLID principles with Java examples.",
    answer: "**S — Single Responsibility**: a class should have one reason to change. Split `User` (data) from `UserRepository` (persistence). **O — Open/Closed**: open for extension, closed for modification. Add new shapes by implementing `Shape`, not by editing `AreaCalculator`. **L — Liskov Substitution**: subtypes must be usable wherever the base type is expected — don't violate base contracts (classic `Square extends Rectangle` violation). **I — Interface Segregation**: many small focused interfaces beat one fat one — split `Worker` into `Workable` and `Eatable`. **D — Dependency Inversion**: depend on abstractions, not concretions — inject `NotificationService` rather than `new EmailService()`.",
    proTip: "Tie SOLID to real Spring usage: DI containers enforce DIP; `@Service`/`@Repository` separation embodies SRP; interface-based DI naturally supports OCP/ISP.",
    tags: ["solid", "principles", "design"]
  },

  // ============ SPRING (5) ============
  {
    id: 71, topic: "spring", topicLabel: "Spring Framework", subtopic: "Spring Boot", difficulty: "medium",
    question: "How does Spring Boot auto-configuration work?",
    answer: "Auto-configuration is enabled by `@SpringBootApplication` (which includes `@EnableAutoConfiguration`). On startup, Spring Boot scans the classpath for `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (Boot 3+) or `META-INF/spring.factories` (Boot 2). Each auto-config class is annotated with conditionals like `@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnProperty` — beans are registered only if the conditions are met. This way, adding a starter dependency 'just works' without XML.",
    proTip: "Use `--debug` (or `debug=true` in application.properties) to print the auto-configuration report — shows which configs matched and why others didn't.",
    tags: ["spring-boot", "auto-configuration"]
  },
  {
    id: 72, topic: "spring", topicLabel: "Spring Framework", subtopic: "Dependency Injection", difficulty: "medium",
    question: "What is the difference between Constructor and Field injection in Spring?",
    answer: "**Constructor injection** (recommended) — dependencies are passed via the constructor; fields can be `final` (immutable); Spring detects circular dependencies at startup; the class is easy to unit test (just call `new`). **Field injection** — uses `@Autowired` directly on fields; concise but the class can't be instantiated without Spring/reflection, hides required dependencies, and complicates testing. **Setter injection** is best for optional dependencies.",
    proTip: "Since Spring 4.3, single-constructor classes get implicit `@Autowired` — no annotation needed. Combined with Lombok's `@RequiredArgsConstructor`, constructor injection becomes one line.",
    codeSnippet: `@Service
public class OrderService {
    private final PaymentGateway gateway;        // final & immutable
    private final InventoryRepo inventory;
    public OrderService(PaymentGateway g, InventoryRepo i) {
        this.gateway = g;
        this.inventory = i;
    }
}`,
    tags: ["spring", "di", "constructor-injection"]
  },
  {
    id: 73, topic: "spring", topicLabel: "Spring Framework", subtopic: "Web", difficulty: "easy",
    question: "What is the difference between @RestController and @Controller?",
    answer: "**@Controller** marks a Spring MVC controller — methods return view names that a `ViewResolver` renders (e.g., a Thymeleaf template). To return JSON, you must annotate methods with `@ResponseBody`. **@RestController** is a convenience meta-annotation = `@Controller` + `@ResponseBody` on every method — return values are serialized directly to the HTTP response body (typically JSON via Jackson). Use `@RestController` for REST APIs; `@Controller` for server-rendered apps.",
    proTip: "If you need to return JSON from a few endpoints in an MVC app, annotate just those methods with `@ResponseBody` rather than mixing controllers — keeps intent clear.",
    codeSnippet: `@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping("/{id}")
    public User get(@PathVariable Long id) {
        return service.findById(id); // serialized to JSON
    }
}`,
    tags: ["spring", "rest", "controller"]
  },
  {
    id: 74, topic: "spring", topicLabel: "Spring Framework", subtopic: "Beans", difficulty: "medium",
    question: "Explain the Spring Bean lifecycle.",
    answer: "Lifecycle: **(1)** Container instantiates the bean. **(2)** Populates dependencies (DI). **(3)** Calls `BeanNameAware`, `BeanFactoryAware`, `ApplicationContextAware` setters. **(4)** Calls `BeanPostProcessor.postProcessBeforeInitialization`. **(5)** Calls `@PostConstruct`, then `InitializingBean.afterPropertiesSet()`, then custom `initMethod`. **(6)** Calls `BeanPostProcessor.postProcessAfterInitialization` (where AOP proxies are created). **(7)** Bean is ready. **(8)** On context shutdown: `@PreDestroy`, `DisposableBean.destroy()`, custom `destroyMethod`.",
    proTip: "Default scope is **singleton** — one instance per container. Other scopes: prototype, request, session, application, websocket. Singleton beans must be stateless or thread-safe.",
    tags: ["spring", "bean-lifecycle"]
  },
  {
    id: 75, topic: "spring", topicLabel: "Spring Framework", subtopic: "AOP & Security", difficulty: "hard",
    question: "What is Spring AOP and how does it work?",
    answer: "**AOP (Aspect-Oriented Programming)** modularizes cross-cutting concerns (logging, transactions, security, caching) into **aspects** instead of scattering them across business code. Spring AOP uses **runtime proxies**: JDK dynamic proxies for interface-based beans, or CGLIB subclass proxies for classes. Key terms: **Aspect** (the module), **Advice** (the action: `@Before`, `@After`, `@Around`, `@AfterReturning`, `@AfterThrowing`), **Pointcut** (where to apply, via expressions), **JoinPoint** (a specific execution point). `@Transactional` and `@Cacheable` are AOP-powered.",
    proTip: "Self-invocation pitfall: calling an `@Transactional` method from another method in the same class bypasses the proxy — the annotation won't apply. Inject self or move to another bean.",
    codeSnippet: `@Aspect
@Component
public class LoggingAspect {
    @Around("execution(* com.app.service..*(..))")
    public Object log(ProceedingJoinPoint pjp) throws Throwable {
        long t = System.currentTimeMillis();
        Object out = pjp.proceed();
        System.out.println(pjp.getSignature() + " took " + (System.currentTimeMillis() - t) + "ms");
        return out;
    }
}`,
    tags: ["spring", "aop", "proxy"]
  },

  // ============ CODING CHALLENGES (5) ============
  {
    id: 76, topic: "coding-challenges", topicLabel: "Coding Challenges", subtopic: "Linked Lists", difficulty: "medium",
    question: "Reverse a linked list — both iteratively and recursively.",
    answer: "**Iterative** O(n) time / O(1) space: walk with `prev`, `curr`, `next`; flip each pointer. **Recursive** O(n) time / O(n) space: recurse to the tail, then on the way back set `head.next.next = head; head.next = null;`. Both return the new head. The iterative version is preferred when the list might be very long (avoids stack overflow).",
    proTip: "Always ask: 'Is the list singly or doubly linked?' For doubly-linked, you also need to swap `prev` and `next` on each node.",
    codeSnippet: `// Iterative
ListNode reverseIter(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}
// Recursive
ListNode reverseRec(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode newHead = reverseRec(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
}`,
    tags: ["linked-list", "reverse", "challenge"]
  },
  {
    id: 77, topic: "coding-challenges", topicLabel: "Coding Challenges", subtopic: "Arrays", difficulty: "easy",
    question: "Find all duplicates in an integer array.",
    answer: "**Approach 1 (HashSet)** O(n) time / O(n) space: iterate, return elements that fail to add. **Approach 2 (in-place, when 1 ≤ nums[i] ≤ n)** O(n) time / O(1) extra space: for each value v = |nums[i]|, negate nums[v-1]; if it was already negative, v is a duplicate. Clarify constraints first to pick the right approach.",
    proTip: "Be explicit about output: 'unique duplicates' vs 'every duplicate occurrence'. Many candidates assume one and lose points.",
    codeSnippet: `// HashSet approach
List<Integer> findDuplicates(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    List<Integer> dup = new ArrayList<>();
    for (int n : nums) if (!seen.add(n)) dup.add(n);
    return dup;
}
// In-place (nums[i] in [1..n])
List<Integer> findDuplicatesInPlace(int[] nums) {
    List<Integer> res = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
        int idx = Math.abs(nums[i]) - 1;
        if (nums[idx] < 0) res.add(idx + 1);
        else nums[idx] = -nums[idx];
    }
    return res;
}`,
    tags: ["array", "duplicates", "hashing"]
  },
  {
    id: 78, topic: "coding-challenges", topicLabel: "Coding Challenges", subtopic: "Design", difficulty: "hard",
    question: "Implement an LRU Cache using LinkedHashMap.",
    answer: "Extend `LinkedHashMap` with **access-order** mode (`accessOrder = true` in the 3-arg constructor). Override `removeEldestEntry` to return `true` when `size() > capacity`. The map automatically reorders entries on access (`get` and `put`) so the eldest = least-recently-used. All operations are O(1). For a from-scratch implementation, combine a `HashMap` with a doubly-linked list — same time complexity.",
    proTip: "`LinkedHashMap` is not thread-safe; wrap with `Collections.synchronizedMap` or use Caffeine/Guava cache for concurrent LRU.",
    codeSnippet: `class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;
    public LRUCache(int capacity) {
        super(capacity, 0.75f, true); // accessOrder = true
        this.capacity = capacity;
    }
    @Override protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}
LRUCache<Integer, String> c = new LRUCache<>(3);
c.put(1, "a"); c.put(2, "b"); c.put(3, "c");
c.get(1);                       // 1 becomes most recent
c.put(4, "d");                  // evicts 2`,
    tags: ["lru", "cache", "design", "linkedhashmap"]
  },
  {
    id: 79, topic: "coding-challenges", topicLabel: "Coding Challenges", subtopic: "Graphs", difficulty: "medium",
    question: "Implement BFS and DFS traversal of a graph.",
    answer: "Represent the graph as `Map<Integer, List<Integer>>`. **BFS** uses a queue and a visited set — explores level by level (best for shortest path in unweighted graphs). **DFS** uses recursion or an explicit stack — goes deep first (best for connectivity, cycle detection, topological sort). Both are O(V + E) time and O(V) space.",
    proTip: "For disconnected graphs, loop over all vertices and start a fresh traversal for any unvisited one — otherwise you only cover one component.",
    codeSnippet: `void bfs(Map<Integer, List<Integer>> g, int start) {
    Set<Integer> seen = new HashSet<>();
    Queue<Integer> q = new ArrayDeque<>();
    q.offer(start); seen.add(start);
    while (!q.isEmpty()) {
        int n = q.poll();
        System.out.println(n);
        for (int nb : g.getOrDefault(n, List.of()))
            if (seen.add(nb)) q.offer(nb);
    }
}
void dfs(Map<Integer, List<Integer>> g, int n, Set<Integer> seen) {
    if (!seen.add(n)) return;
    System.out.println(n);
    for (int nb : g.getOrDefault(n, List.of())) dfs(g, nb, seen);
}`,
    tags: ["graph", "bfs", "dfs", "challenge"]
  },
  {
    id: 80, topic: "coding-challenges", topicLabel: "Coding Challenges", subtopic: "Stacks", difficulty: "medium",
    question: "Design a stack that supports getMin() in O(1).",
    answer: "Maintain a second stack tracking the running minimum. On `push(x)`: push x to the data stack; push `min(x, minStack.peek())` (or x if empty) to the min stack. On `pop`: pop both. `getMin` returns the top of the min stack. All operations are O(1) time, O(n) extra space. A space-optimized variant pushes to the min stack only when a new minimum appears, but you must also pop only when popping the actual min — slightly trickier.",
    proTip: "If asked to optimize space further: store `2*x - currentMin` on the data stack itself when x < currentMin — encodes the previous min into the new value. Show this for senior interviews.",
    codeSnippet: `class MinStack {
    Deque<Integer> data = new ArrayDeque<>();
    Deque<Integer> mins = new ArrayDeque<>();
    public void push(int x) {
        data.push(x);
        mins.push(mins.isEmpty() ? x : Math.min(x, mins.peek()));
    }
    public void pop()    { data.pop(); mins.pop(); }
    public int top()     { return data.peek(); }
    public int getMin()  { return mins.peek(); }
}`,
    tags: ["stack", "min-stack", "design", "challenge"]
  },
];
