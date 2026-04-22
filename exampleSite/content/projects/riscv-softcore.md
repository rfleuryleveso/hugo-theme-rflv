---
title: "Pipelined RISC-V RV32IM Softcore on Artix-7 FPGA"
date: 2023-11-20
description: "A 5-stage in-order RISC-V RV32IM softcore implemented in VHDL, synthesisable on Xilinx Artix-7, achieving 80 MHz with full hazard detection and forwarding."
tags: ["RISC-V", "VHDL", "FPGA", "Artix-7", "hardware design"]
status: "active"
github: "https://github.com/rfleuryleveso/rv32im-softcore"
category: "Hardware Design"
featured: true
---

## Overview

A fully pipelined RV32IM implementation written in synthesisable VHDL-2008. The design targets Xilinx Artix-7 (xc7a35t) and is validated against the official RISC-V compliance test suite.

{{< chip "VHDL, RISC-V, Artix-7, Vivado" >}}

## Pipeline Stages

| Stage | Description |
|-------|-------------|
| IF    | Instruction fetch, PC update, branch prediction (static not-taken) |
| ID    | Register file read, immediate decode, hazard detection |
| EX    | ALU, multiplier (3-cycle), branch resolution |
| MEM   | Data memory access, load alignment |
| WB    | Register writeback, forwarding MUX select |

## Key Design Decisions

### Forwarding Network

Full EX→EX and MEM→EX forwarding eliminates all data hazards except load-use (1 bubble inserted by the hazard unit).

```vhdl
-- EX forwarding select
forward_a <= "10" when (ex_mem_reg_write = '1' and
                        ex_mem_rd /= "00000" and
                        ex_mem_rd = id_ex_rs1) else
             "01" when (mem_wb_reg_write = '1' and
                        mem_wb_rd /= "00000" and
                        mem_wb_rd = id_ex_rs1) else
             "00";
```

## Synthesis Results (xc7a35t-1)

| Metric | Value |
|--------|-------|
| LUTs   | 3,241 |
| FFs    | 1,087 |
| BRAM   | 4     |
| Fmax   | 82 MHz |
| CoreMark | 1.41 CM/MHz |
