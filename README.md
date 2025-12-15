# Drug-Court-Learning-Platform
This app is to assist accountability court class facilitators and participants
Drug Court Learning Platform

This project is a role-based web application designed to support accountability court participants and facilitators during structured psychoeducational programs. The platform focuses on reducing cognitive load for participants while giving facilitators clear instructional tools and session control.

Core Concept

The system is built around one class and one set of sessions, rendered differently depending on user role.

Facilitators access full instructional content, session flow guidance, prompts, and administrative controls.

Participants see a simplified, task-focused version of the same session, including brief objectives and limited reflection or response inputs.

There are not separate classes or curricula for each role. The difference is strictly in visibility and presentation, not structure.

Intended Use

The platform is designed for accountability court populations who often experience educational gaps, impaired attention, and difficulty retaining information. Sessions are intentionally structured to emphasize clarity, repetition, and single-task engagement.

Design Principles

One source of truth for class and session data

Role-based rendering (facilitator vs. participant)

Minimal cognitive load for participants

Facilitator-first content design

Progressive enhancement rather than over-engineering

Technology Overview

This project uses a modern web stack with:

A single repository as the source of truth

Continuous deployment for rapid iteration

Role-aware routing and rendering

A sandboxed UI workflow for fast experimentation

Specific tools and services may evolve, but the architectural principles are intended to remain stable.

Project Status

This project is under active development. Core focus areas include session flow, role separation, and usability testing with real-world accountability court scenarios.
