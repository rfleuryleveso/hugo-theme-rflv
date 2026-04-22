---
title: "Zephyr RTOS CAN FD Driver for STM32G0"
date: 2024-06-01
description: "A production-quality CAN FD driver contributed to the Zephyr RTOS mainline, supporting ISO 11898-1:2015 with AUTOSAR CanIf compatibility layer."
tags: ["Zephyr", "CAN FD", "STM32", "RTOS", "C", "embedded"]
status: "merged upstream"
github: "https://github.com/rfleuryleveso/zephyr-stm32g0-canfd"
featured: true
---

## Overview

This project implements a complete CAN FD controller driver for the STM32G0 series (FDCAN peripheral) targeting the Zephyr RTOS device driver model.

{{< chip "C, Zephyr RTOS, CAN FD, STM32G0" >}}

## Features

- **ISO 11898-1:2015** compliant CAN FD frame handling (up to 64-byte payload)
- **Bit-rate switching** (BRS) with separate nominal and data-phase prescalers
- **TX FIFO** with configurable depth and priority arbitration
- **RX FIFO 0/1** with hardware acceptance filters (range, mask, exact-match)
- **Loopback** and **Bus-Monitor** modes for diagnostics
- **Error passive / Bus-off** recovery with Zephyr work-queue integration

## Architecture

```
┌──────────────────────────────────────┐
│          Zephyr CAN API              │
│  can_send() / can_add_rx_filter()    │
└──────────────┬───────────────────────┘
               │ struct can_driver_api
┌──────────────▼───────────────────────┐
│      stm32g0_fdcan driver            │
│  - DTS binding (fdcan0/1)            │
│  - Clock / pinctrl init              │
│  - ISR: TX complete, RX FIFO, Error  │
└──────────────┬───────────────────────┘
               │ MMIO
┌──────────────▼───────────────────────┐
│       STM32G0 FDCAN peripheral       │
└──────────────────────────────────────┘
```

## Usage

Add to your `prj.conf`:

```
CONFIG_CAN=y
CONFIG_CAN_STM32_FDCAN=y
CONFIG_CAN_FD_MODE=y
```

And in your devicetree overlay:

```dts
&fdcan1 {
    status = "okay";
    clocks = <&rcc STM32_CLOCK_BUS_APB1 0x02000000>;
    bus-speed = <500000>;
    bus-speed-data = <2000000>;
    pinctrl-0 = <&fdcan1_rx_pb8 &fdcan1_tx_pb9>;
    pinctrl-names = "default";
};
```

{{< note type="tip" >}}
Set `bus-speed-data` to at most 4× `bus-speed` to remain within the transceiver's propagation delay budget for most cable lengths.
{{< /note >}}

## Status

The driver has been merged into Zephyr mainline as of v3.6. See the upstream PR for the full review history.
