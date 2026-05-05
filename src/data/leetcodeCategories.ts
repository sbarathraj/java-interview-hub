export interface LeetCategory {
  id: string;
  name: string;
  subtopics: string[];
  emoji: string;
}

export const LEETCODE_CATEGORIES: LeetCategory[] = [
  { id: "arrays", name: "Arrays", emoji: "📊", subtopics: ["Two Pointer", "Sliding Window", "Prefix Sum", "Kadane's", "Matrix"] },
  { id: "strings", name: "Strings", emoji: "🔤", subtopics: ["Anagram", "Palindrome", "Substring", "Pattern Matching", "KMP"] },
  { id: "linked-lists", name: "Linked Lists", emoji: "🔗", subtopics: ["Singly", "Doubly", "Circular", "Fast & Slow Pointer", "Reversal"] },
  { id: "stacks", name: "Stacks", emoji: "📚", subtopics: ["Monotonic Stack", "Next Greater Element", "Valid Parentheses"] },
  { id: "queues", name: "Queues", emoji: "🚶", subtopics: ["Deque", "Priority Queue", "Circular Queue", "BFS Queue"] },
  { id: "hashing", name: "Hashing / HashMap", emoji: "🗝️", subtopics: ["Two Sum", "Group Anagrams", "Frequency Count", "Subarray Sum"] },
  { id: "trees", name: "Trees", emoji: "🌳", subtopics: ["Binary Tree", "BST", "Traversals", "LCA", "Height", "Diameter"] },
  { id: "binary-search", name: "Binary Search", emoji: "🔎", subtopics: ["Search in Rotated Array", "Peak Element", "Matrix Search"] },
  { id: "heaps", name: "Heaps", emoji: "⛰️", subtopics: ["Kth Largest", "Top K Frequent", "Merge K Sorted Lists"] },
  { id: "graphs", name: "Graphs", emoji: "🕸️", subtopics: ["BFS", "DFS", "Topological Sort", "Dijkstra", "Union-Find", "Cycle Detection"] },
  { id: "dp", name: "Dynamic Programming", emoji: "🧮", subtopics: ["1D DP", "2D DP", "Knapsack", "LIS", "LCS", "Coin Change", "Grid Path"] },
  { id: "greedy", name: "Greedy", emoji: "💰", subtopics: ["Interval Scheduling", "Activity Selection", "Jump Game"] },
  { id: "backtracking", name: "Backtracking", emoji: "🔙", subtopics: ["Permutations", "Combinations", "N-Queens", "Sudoku Solver"] },
  { id: "recursion", name: "Recursion", emoji: "🔁", subtopics: ["Fibonacci", "Tower of Hanoi", "Subsets", "Power Set"] },
  { id: "sorting", name: "Sorting & Searching", emoji: "🔃", subtopics: ["QuickSort", "MergeSort", "Counting Sort", "Binary Search Variants"] },
  { id: "bit-manipulation", name: "Bit Manipulation", emoji: "💡", subtopics: ["XOR tricks", "Single Number", "Power of Two", "Bit Masking"] },
  { id: "trie", name: "Trie", emoji: "🌲", subtopics: ["Insert/Search", "Autocomplete", "Word Break"] },
  { id: "sliding-window", name: "Sliding Window", emoji: "🪟", subtopics: ["Max Sum Subarray", "Longest Substring", "Minimum Window"] },
  { id: "two-pointers", name: "Two Pointers", emoji: "👉", subtopics: ["Container With Most Water", "3Sum", "Remove Duplicates"] },
  { id: "math", name: "Math & Logic", emoji: "🔢", subtopics: ["GCD", "Primes", "Factorial", "Modular Arithmetic"] },
];

export const getCategory = (id: string) => LEETCODE_CATEGORIES.find((c) => c.id === id);
export const getCategoryName = (id: string) => getCategory(id)?.name ?? id;

export const COMMON_TAGS = [
  "HashMap", "Array", "String", "Two Pointer", "Sliding Window", "DFS", "BFS",
  "Recursion", "DP", "Greedy", "Stack", "Queue", "Heap", "Tree", "Graph",
  "Binary Search", "Sorting", "Math", "Bit Manipulation", "Trie", "Linked List",
  "Backtracking", "Prefix Sum", "Monotonic Stack", "Union Find",
];
