---
pubDatetime: 2026-07-18T23:14:15.000+08:00
title: "区间调度问题"
tags:
  - 算法
  - 计算机基础
  - 笔记
description: 在最大数量的区间调度中，应该选择“结束最早”的工作，因为它最少限制未来；交换论证保证这种局部选择最终构成全局最优解。
---

> Reasonable-looking algorithms can easily be incorrect. Algorithm correctness is a property that must be carefully demonstrated.

## 目录

## 前言

这一节讨论了经典的区间调度问题。

假设有 $n$ 部电影邀请，每部电影 $i$ 都有开始拍摄时间 $s_i$ 和结束拍摄时间 $f_i$，一旦接下某部电影，就必须完整参与这段时间，因此时间重叠的两部电影不能同时接。

简单来说就是：

- 输入：区间集合 $I={[s_1,f_1],\ldots,[s_n,f_n]}$
- 输出：最大的两两不重叠子集 $S\subseteq I$

区间通常定义为半开区间 $[s_i,f_i)$，因此一项工作恰好在另一项结束时开始是允许的，即：$s_j \ge f_i$。

## EarliestJobFirst

第一种方案的基本思路是：既然现在有工作可做，就先接受开始时间最早的工作，但存在的问题是某些工作开始早，并不代表结束早。

```text
不断选择尚未冲突的、开始时间最早的工作。
```

例如：

```text
长工作：|-------------------------------|
短工作：  |--| |--| |--| |--| |--| |--|
```

长工作最早开始，却占据了几乎全部时间。选择它只能完成 1 项工作，而最优解可以选择许多短工作。

所以可以理解为：**最早开始**只优化了一个无关紧要的局部指标。

真正重要的是：如何确保在选择某一个工作以后，还给未来留下多少空间。

## ShortestJobFirst

第二种方案是：为了完成尽可能多的工作，每次选择长度最短的工作。

```text
当还有工作时：
    选择持续时间最短的工作 j
    删除 j 以及所有与 j 冲突的工作
```

此方案比第一种方案要好一些，但仍旧存在瑕疵。

例如：

```text
工作 A：|------|
工作 B：    |---|
工作 C：       |------|
```

工作 B 最短，但它同时与 A、C 重叠。选择 B 后只能得到 1 项工作；不选择 B，却可以选择互不冲突的 A 和 C，得到 2 项。

之所以会出现这种问题，是因为区间长度反映的是工作自身占用的时间，却没有反映它位于整个时间轴的位置，而一个长度很短但位于**中间位置**的区间就可能同时导致左右两侧的区间被删除。

## ExhaustiveScheduling

此方案抛弃了局部优化的思路：既然局部规则不可靠，那就枚举所有可能的工作集合。

```text
best = 空集
枚举 I 的每个子集 S：
    如果 S 中的区间互不重叠，并且 |S| > |best|：
        best = S
返回 best
```

这个方案能够保证一定得到正确结果，因为最优解必然是 I 的某个子集，而算法遍历了所有的子集。

但 n 个元素有 $2^n$ 个子集，$n=20$ 时，子集约有 $10^6$ 个，普通计算机还能处理此等量级的遍历，但当 $n=100$ 时，$2^{100}\approx 1.27\times10^{30}$ 这个数量级的操作就不是普通计算机能够处理得了的了。

## OptimalScheduling

真正可行的方案是：优先选择结束时间最早的工作。

```text
当集合 I 非空时：
    接受 I 中结束时间最早的工作 j
    删除 j 以及所有与 j 重叠的区间
```

从直觉来看，工作的结束时间越早，就给未来留下了更多的时间：

```text
现在             未来
------------------------------>

选择 x：|----|
剩余：       很大的可用空间

选择 y：|-------------|
剩余：                较小空间
```

但仅靠直觉是不能够证明其正确性的，我们需要确保不存在一个结束稍晚的工作却能和前面的某些工作形成更好的组合情况。

## 证明贪心选择不会损失最优性

设 $x$ 为所有工作中结束时间最早的工作，$O$ 为任意一个最优解，$y$ 是最优解 $O$ 中最先执行的工作；因为 $x$ 是所有工作中结束最早的，所以 $f(x)\le f(y)$，现在把最优解中的 \(y\) 换成 \(x\)。

原来排在 $y$ 后面的每项工作 $z$ 都满足 $s(z)\ge f(y)$，又因为 $f(x)\le f(y) $，所以 $s(z)\ge f(y)\ge f(x)$

因此，原来能接在 $y$ 后面的所有工作，也一定能接在 $x$ 后面。

于是 $O'=(O-\{y\})\cup\{x\} $ 仍然是合法解，而且工作数量没有减少。

这说明，至少存在一个最优解包含结束时间最早的工作 $x$。

> 只要证明存在一个包含 $x$ 的最优解，就足以安全地进行这个贪心选择。

## 举一个例子

假设工作如下：

| 工作 | 开始 | 结束 |
| ---- | ---: | ---: |
| A    |    1 |    4 |
| B    |    3 |    5 |
| C    |    0 |    6 |
| D    |    5 |    7 |
| E    |    3 |    9 |
| F    |    6 |   10 |
| G    |    8 |   11 |
| H    |    8 |   12 |
| I    |    2 |   14 |
| J    |   12 |   16 |

按结束时间排序后依次扫描：

1. 选择 $A=[1,4)$，因为它结束最早。
2. $B,C,E$ 与 $A$ 冲突，跳过。
3. 选择 $D=[5,7)$。
4. $F$ 在 6 开始，与 $D$ 冲突。
5. 选择 $G=[8,11)$。
6. $H$ 与 $G$ 冲突。
7. $I$ 也冲突。
8. 选择 $J=[12,16)$。

最终得到 $[A,D,G,J]$，共 4 项工作。

## 时间复杂度

如果直接按照书中的“寻找最早结束工作，再删除冲突区间”实现，反复查找可能写成 $O(n^2)$。

更好的实现是：

1. 按结束时间排序：$$O(n\log n)$$
2. 从左到右扫描一次：$$O(n)$$

总复杂度 $O(n\log n)$，如果输入已经按结束时间排序，则只需 $O(n)$。

输出需要保存 $k$ 个被选择的区间，因此额外空间通常为 $O(k)$。

## 代码实现

下面是上述三种方案的 TypeScript 实现。

```ts
// 使用半开区间 [start, end)：
type Interval = {
  start: number;
  end: number;
};

function earliestStartFirst(intervals: Interval[]): Interval[] {
  // 按照开始时间升序
  const sortedIntervals = [...intervals].sort((a, b) => a.start - b.start);

  const results: Interval[] = [];
  let lastEnd = -Infinity;

  for (const interval of sortedIntervals) {
    // 直接判断后一个区间是否在上一个区间结束之后开始
    if (interval.start >= lastEnd) {
      results.push(interval);
      lastEnd = interval.end;
    }
  }

  return results;
}

function getIntervalLength(interval: Interval): number {
  return interval.end - interval.start;
}

function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

function shortestJobFirst(intervals: Interval[]): Interval[] {
  let remaining = [...intervals].sort(
    (a, b) => getIntervalLength(a) - getIntervalLength(b)
  );

  const results: Interval[] = [];

  while (remaining.length > 0) {
    // remaining 已按持续时间排序
    const selectedInterval = remaining.shift();

    if (selectedInterval === undefined) {
      break;
    }

    results.push(selectedInterval);

    // 删除与本轮选中区间重叠的区间
    remaining = remaining.filter(
      interval => !overlaps(selectedInterval, interval)
    );
  }

  return results;
}

function earliestFinishFirst(intervals: Interval[]): Interval[] {
  // 按照结束时间升序
  const sortedIntervals = [...intervals].sort((a, b) => a.end - b.end);

  const results: Interval[] = [];
  let lastEnd = -Infinity;

  for (const interval of sortedIntervals) {
    // 直接判断后一个区间是否在上一个区间结束之后开始
    if (interval.start >= lastEnd) {
      results.push(interval);
      lastEnd = interval.end;
    }
  }

  return results;
}
```

## 小结

1. 合理的直觉不等于正确的算法：**最早开始**和**持续时间最短**都很自然，却都能被简单反例击败。
2. 设计贪心算法时，要寻找**安全选择**：不是随便找一个看起来不错的局部指标，而是证明这个选择能够出现在某个最优解中。
3. 交换论证是证明贪心算法的重要工具：从任意最优解出发，把它的第一步换成贪心选择，同时不降低解的质量。
4. 主动寻找反例是算法设计的一部分：对一个候选算法，不要只寻找支持它的例子；应该尝试构造能让它失败的极端输入。
