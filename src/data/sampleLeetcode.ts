// Starter samples seeded into the user's account on first visit.
export interface SampleSolution {
  problem_number: number;
  title: string;
  leetcode_url: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  tags: string[];
  status: "solved" | "revisit" | "unsolved";
  date_solved: string;
  code: string;
  approach: string;
  time_complexity: string;
  space_complexity: string;
  notes: string;
}

export const SAMPLE_SOLUTIONS: SampleSolution[] = [
  {
    problem_number: 1, title: "Two Sum",
    leetcode_url: "https://leetcode.com/problems/two-sum/",
    difficulty: "easy", category: "hashing", tags: ["HashMap", "Array"],
    status: "solved", date_solved: "2024-11-15",
    code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
    approach: "Use HashMap to store each number's index. For each element, check if complement exists in map.",
    time_complexity: "O(n)", space_complexity: "O(n)",
    notes: "Edge case: same element used twice. HashMap handles this by checking before inserting.",
  },
  {
    problem_number: 121, title: "Best Time to Buy and Sell Stock",
    leetcode_url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    difficulty: "easy", category: "arrays", tags: ["Array", "DP"],
    status: "solved", date_solved: "2024-11-16",
    code: `class Solution {
    public int maxProfit(int[] prices) {
        int min = Integer.MAX_VALUE, profit = 0;
        for (int p : prices) {
            min = Math.min(min, p);
            profit = Math.max(profit, p - min);
        }
        return profit;
    }
}`,
    approach: "Track running minimum and best profit seen so far in a single pass.",
    time_complexity: "O(n)", space_complexity: "O(1)",
    notes: "Watch for empty arrays — return 0.",
  },
  {
    problem_number: 53, title: "Maximum Subarray",
    leetcode_url: "https://leetcode.com/problems/maximum-subarray/",
    difficulty: "medium", category: "arrays", tags: ["Array", "DP", "Kadane"],
    status: "solved", date_solved: "2024-11-18",
    code: `class Solution {
    public int maxSubArray(int[] nums) {
        int cur = nums[0], best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]);
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
    approach: "Kadane's algorithm: at each index keep best subarray ending here vs starting fresh.",
    time_complexity: "O(n)", space_complexity: "O(1)",
    notes: "Initialize with nums[0] to handle all-negative arrays.",
  },
  {
    problem_number: 20, title: "Valid Parentheses",
    leetcode_url: "https://leetcode.com/problems/valid-parentheses/",
    difficulty: "easy", category: "stacks", tags: ["Stack", "String"],
    status: "solved", date_solved: "2024-11-20",
    code: `class Solution {
    public boolean isValid(String s) {
        Deque<Character> st = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') st.push(')');
            else if (c == '[') st.push(']');
            else if (c == '{') st.push('}');
            else if (st.isEmpty() || st.pop() != c) return false;
        }
        return st.isEmpty();
    }
}`,
    approach: "Push the matching closer on open. On a closer, ensure it equals the top.",
    time_complexity: "O(n)", space_complexity: "O(n)",
    notes: "Always check stack empty before pop.",
  },
  {
    problem_number: 206, title: "Reverse Linked List",
    leetcode_url: "https://leetcode.com/problems/reverse-linked-list/",
    difficulty: "easy", category: "linked-lists", tags: ["Linked List", "Recursion"],
    status: "solved", date_solved: "2024-11-22",
    code: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, cur = head;
        while (cur != null) {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }
}`,
    approach: "Iteratively flip pointers using prev/cur/next.",
    time_complexity: "O(n)", space_complexity: "O(1)",
    notes: "Recursive version uses O(n) stack.",
  },
  {
    problem_number: 102, title: "Binary Tree Level Order Traversal",
    leetcode_url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    difficulty: "medium", category: "trees", tags: ["Tree", "BFS", "Queue"],
    status: "solved", date_solved: "2024-11-25",
    code: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int n = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                TreeNode t = q.poll();
                level.add(t.val);
                if (t.left != null) q.offer(t.left);
                if (t.right != null) q.offer(t.right);
            }
            res.add(level);
        }
        return res;
    }
}`,
    approach: "Standard BFS with level-size snapshot to group nodes per level.",
    time_complexity: "O(n)", space_complexity: "O(n)",
    notes: "Handle null root separately.",
  },
  {
    problem_number: 200, title: "Number of Islands",
    leetcode_url: "https://leetcode.com/problems/number-of-islands/",
    difficulty: "medium", category: "graphs", tags: ["DFS", "BFS", "Graph"],
    status: "revisit", date_solved: "2024-11-28",
    code: `class Solution {
    public int numIslands(char[][] g) {
        int count = 0;
        for (int i = 0; i < g.length; i++)
            for (int j = 0; j < g[0].length; j++)
                if (g[i][j] == '1') { dfs(g, i, j); count++; }
        return count;
    }
    void dfs(char[][] g, int i, int j) {
        if (i<0||j<0||i>=g.length||j>=g[0].length||g[i][j]!='1') return;
        g[i][j] = '0';
        dfs(g,i+1,j); dfs(g,i-1,j); dfs(g,i,j+1); dfs(g,i,j-1);
    }
}`,
    approach: "DFS flood-fill each unvisited '1' island and count them.",
    time_complexity: "O(m*n)", space_complexity: "O(m*n) recursion",
    notes: "Could use iterative BFS to avoid stack overflow on huge grids.",
  },
  {
    problem_number: 70, title: "Climbing Stairs",
    leetcode_url: "https://leetcode.com/problems/climbing-stairs/",
    difficulty: "easy", category: "dp", tags: ["DP", "Math"],
    status: "solved", date_solved: "2024-12-01",
    code: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }
        return b;
    }
}`,
    approach: "Fibonacci-style DP with O(1) space.",
    time_complexity: "O(n)", space_complexity: "O(1)",
    notes: "n <= 2 base case.",
  },
  {
    problem_number: 322, title: "Coin Change",
    leetcode_url: "https://leetcode.com/problems/coin-change/",
    difficulty: "medium", category: "dp", tags: ["DP", "Knapsack"],
    status: "revisit", date_solved: "2024-12-03",
    code: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount+1];
        Arrays.fill(dp, amount+1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++)
            for (int c : coins)
                if (c <= i) dp[i] = Math.min(dp[i], dp[i-c] + 1);
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
    approach: "Bottom-up unbounded knapsack — min coins to form each amount up to target.",
    time_complexity: "O(amount*coins)", space_complexity: "O(amount)",
    notes: "Sentinel value amount+1 to detect infeasible.",
  },
  {
    problem_number: 33, title: "Search in Rotated Sorted Array",
    leetcode_url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    difficulty: "medium", category: "binary-search", tags: ["Binary Search", "Array"],
    status: "solved", date_solved: "2024-12-05",
    code: `class Solution {
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int m = (l + r) >>> 1;
            if (nums[m] == target) return m;
            if (nums[l] <= nums[m]) {
                if (target >= nums[l] && target < nums[m]) r = m - 1; else l = m + 1;
            } else {
                if (target > nums[m] && target <= nums[r]) l = m + 1; else r = m - 1;
            }
        }
        return -1;
    }
}`,
    approach: "Modified binary search — figure out which half is sorted, then narrow.",
    time_complexity: "O(log n)", space_complexity: "O(1)",
    notes: "Use unsigned shift to avoid overflow.",
  },
  {
    problem_number: 215, title: "Kth Largest Element in an Array",
    leetcode_url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    difficulty: "medium", category: "heaps", tags: ["Heap", "Sorting"],
    status: "solved", date_solved: "2024-12-07",
    code: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> h = new PriorityQueue<>();
        for (int n : nums) {
            h.offer(n);
            if (h.size() > k) h.poll();
        }
        return h.peek();
    }
}`,
    approach: "Maintain a min-heap of size k; the root is the kth largest.",
    time_complexity: "O(n log k)", space_complexity: "O(k)",
    notes: "Quickselect gives O(n) average if asked.",
  },
  {
    problem_number: 3, title: "Longest Substring Without Repeating Characters",
    leetcode_url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    difficulty: "medium", category: "sliding-window", tags: ["Sliding Window", "HashMap", "String"],
    status: "solved", date_solved: "2024-12-09",
    code: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character,Integer> last = new HashMap<>();
        int best = 0, l = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (last.containsKey(c) && last.get(c) >= l) l = last.get(c) + 1;
            last.put(c, r);
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}`,
    approach: "Sliding window keyed by last seen index of each char.",
    time_complexity: "O(n)", space_complexity: "O(min(n, alphabet))",
    notes: "Compare last index against current window start before shifting.",
  },
  {
    problem_number: 15, title: "3Sum",
    leetcode_url: "https://leetcode.com/problems/3sum/",
    difficulty: "medium", category: "two-pointers", tags: ["Two Pointer", "Array", "Sorting"],
    status: "revisit", date_solved: "2024-12-11",
    code: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i-1]) continue;
            int l = i+1, r = nums.length-1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[l++], nums[r--]));
                    while (l < r && nums[l] == nums[l-1]) l++;
                    while (l < r && nums[r] == nums[r+1]) r--;
                } else if (sum < 0) l++; else r--;
            }
        }
        return res;
    }
}`,
    approach: "Sort, fix one element, then two pointers; skip duplicates.",
    time_complexity: "O(n²)", space_complexity: "O(1) extra",
    notes: "Skip duplicates aggressively to avoid duplicate triples.",
  },
  {
    problem_number: 78, title: "Subsets",
    leetcode_url: "https://leetcode.com/problems/subsets/",
    difficulty: "medium", category: "backtracking", tags: ["Backtracking", "Recursion"],
    status: "solved", date_solved: "2024-12-13",
    code: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), res);
        return res;
    }
    void backtrack(int[] nums, int idx, List<Integer> cur, List<List<Integer>> res) {
        res.add(new ArrayList<>(cur));
        for (int i = idx; i < nums.length; i++) {
            cur.add(nums[i]);
            backtrack(nums, i+1, cur, res);
            cur.remove(cur.size()-1);
        }
    }
}`,
    approach: "Classic backtracking — at each index choose include/skip.",
    time_complexity: "O(n * 2ⁿ)", space_complexity: "O(n)",
    notes: "Always copy current list when adding to result.",
  },
  {
    problem_number: 191, title: "Number of 1 Bits",
    leetcode_url: "https://leetcode.com/problems/number-of-1-bits/",
    difficulty: "easy", category: "bit-manipulation", tags: ["Bit Manipulation"],
    status: "solved", date_solved: "2024-12-15",
    code: `public class Solution {
    public int hammingWeight(int n) {
        int count = 0;
        while (n != 0) { n &= (n - 1); count++; }
        return count;
    }
}`,
    approach: "Brian Kernighan's trick — n & (n-1) removes the lowest set bit.",
    time_complexity: "O(k) where k = set bits", space_complexity: "O(1)",
    notes: "Java integers are signed — use unsigned right shift if iterating bits.",
  },
];
