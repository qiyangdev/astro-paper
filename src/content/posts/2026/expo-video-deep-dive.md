---
title: "Expo Video Deep Dive"
description: "Explore the package expo-video"
pubDatetime: 2026-07-14T02:54:02Z
tags:
  - Expo
  - Packages
---

Here are some explore about package expo-video.

## Table of contents

## Intro


```mermaid
flowchart LR
  S["VideoSource"] --> H["useVideoPlayer"]
  H --> P["VideoPlayer SharedObject"]
  P --> I["iOS AVPlayer"]
  P --> A["Android ExoPlayer"]
  P --> W["Web HTMLVideoElement"]
  P --> V["VideoView"]
  P --> E["Event System"]
  E --> R["useEvent / useEventListener"]
```