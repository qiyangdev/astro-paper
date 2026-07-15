---
pubDatetime: 2026-07-15T19:09:36.000+08:00
title: "Reflections on AI-Assisted Coding"
tags:
  - AI
  - Programming
  - Learning
description: "Reflections on six months of using AI coding tools, and the difference between writing more code and becoming a better developer."
---

> After all, you only find out who is swimming naked when the tide goes out. — Warren Buffett[^buffett-quote]

After using AI coding tools[^ai-coding-tools] extensively for six months, I started looking back at my work. I built many things, but I also wanted to know how much I had really learned.

For me, an AI coding tool is like a legendary item[^legendary-item] in a game. It is not easy to get, but it has no level requirement. Almost any player can equip it and immediately deal very serious damage. However, this item has a special rule: the player gets no experience points after defeating an enemy.

This comparison is not perfect, but it describes one concern I have. AI coding tools can greatly improve our output, but they do not always improve our own ability.

## Borrowed power

With an AI coding tool, a developer can explore an unfamiliar codebase, write a feature, find the reason for a build failure, or finish a boring migration much faster than before. This value is real. These tools save time and allow us to work on problems that may have been too difficult before.

But better output and better skills are not the same thing.

In a game, the difference becomes clear when the special item is removed during a PVP match.[^pvp] In software development, this moment may come during a production incident, a difficult concurrency bug, or an architecture decision without a clear answer. It can also happen when the AI keeps producing code that looks correct but is actually wrong. When the tool cannot solve the problem, the developer has to depend on their own knowledge.

This does not mean that using AI makes a developer less capable. The problem is that our skills may not grow as fast as our output. In the past, spending a long time on a problem often helped us understand it deeply. Today, AI can help us skip this difficult process. At the same time, we may also skip some important learning.

## Productivity is not progress

AI can make us feel that every problem is solvable if we provide enough context, use enough tokens,[^tokens], or try one more prompt. But this is not always true. We still need to decide what to build, understand the important limits, notice small mistakes, and take responsibility for the final result.

The tool can write code faster than I can. It can also write code that I could not write by myself. But this does not mean that I understand the code.

It is easy to ignore this difference. We can see more commits, more features, and more completed experiments. We also spend less time being blocked by unfamiliar details. However, a project can improve while the developer learns very little.

Looking back on the past six months, I used a very large number of tokens, but I did not feel the same amount of personal growth. I started coding because I enjoyed it. In the atmosphere of vibe coding,[^vibe-coding] every idea can quickly become a new task, prototype, or pull request. After some time, coding started to feel more like work than a hobby. I found this a little ironic.

## Keeping the experience points

For me, the answer is not to stop using AI coding tools. They are useful, and refusing to use them does not automatically make someone a better developer. The real challenge is to use these tools without giving the whole learning process to AI.

I can pause before accepting an answer and trace the code path by myself. I can try to predict the reason for a failure before asking AI to explain it. I can also rewrite an explanation in my own words. Sometimes, I should solve a problem without AI and accept that it may take more time. Most importantly, I should understand the generated code instead of only making sure that it works.

AI can remove many difficulties from programming, but these difficulties were not always a waste of time. They helped us build experience, judgment, and confidence. If I remove all of them, I may finish more tasks, but become less ready for problems that AI cannot solve.

The tide will go out one day. I do not need to throw away the equipment, but I should make sure that I can still swim without it.

[^buffett-quote]: This sentence appears in Warren Buffett's [2001 letter to Berkshire Hathaway shareholders](https://www.berkshirehathaway.com/letters/2001pdf.pdf). It was originally used to discuss hidden risks in the insurance industry.

[^ai-coding-tools]: In this article, “AI coding tools” means software based on large language models that can generate, explain, review, or modify code through natural-language instructions.

[^legendary-item]: In many games, a legendary item is a rare and powerful piece of equipment. The exact name and rarity level are different in each game.

[^pvp]: PVP means “player versus player.” It describes a game mode in which players compete directly against other players instead of computer-controlled enemies.

[^tokens]: Tokens are small units of text processed by a language model. Token usage is often used to measure how much input and output the model has processed. It is not a direct measurement of learning or useful work.

[^vibe-coding]: Here, “vibe coding” means a style of programming that depends heavily on natural-language prompts and AI-generated code, with more attention on getting a result quickly than understanding every implementation detail.
