---
title: "CAN FD for Embedded Engineers: A Practical Introduction"
date: 2024-04-03
description: "A ground-up explanation of CAN FD (ISO 11898-1:2015) for engineers familiar with classic CAN, covering frame format, bit-rate switching, and common driver pitfalls."
tags: ["CAN FD", "automotive", "embedded", "protocols", "STM32"]
category: "Protocols"
categories: ["protocols"]
---

CAN FD extends classic CAN in two important ways: payload up to **64 bytes** (vs. 8), and an optional **higher data-phase bit rate** (up to ~8 Mbit/s in practice). If you understand classic CAN, you are 80% of the way there.

## Frame format differences

```
Classic CAN:  SOF | Arbitration (11/29b) | Control | Data (0-8B)  | CRC-15 | ACK | EOF
CAN FD:       SOF | Arbitration (11/29b) | Control | Data (0-64B) | CRC-17/21 | ACK | EOF
                                                      ↑ BRS bit here
```

The **BRS** (Bit Rate Switch) bit, when set, causes all nodes to switch to the data-phase bit rate immediately after it. The **ESI** (Error State Indicator) replaces the RTR bit and signals a node's error state.

## Bit timing configuration

With two independent bit rates you must configure two sets of prescalers. On STM32 (FDCAN peripheral):

```c
FDCAN_InitTypeDef init = {
    /* Nominal phase (arbitration): 500 kbit/s @ 80 MHz APB */
    .NominalPrescaler      = 1,
    .NominalSyncJumpWidth  = 8,
    .NominalTimeSeg1       = 139,  /* prop + phase1 */
    .NominalTimeSeg2       = 20,

    /* Data phase: 2 Mbit/s @ 80 MHz APB */
    .DataPrescaler         = 1,
    .DataSyncJumpWidth     = 4,
    .DataTimeSeg1          = 34,
    .DataTimeSeg2          = 5,
};
```

{{< note type="tip" >}}
Use the STM32CubeMX CAN FD bit-timing calculator or Kvaser's online tool to generate prescaler values — the manual maths is error-prone.
{{< /note >}}

## Common pitfalls

1. **Transceiver bandwidth**: most classic CAN transceivers (TJA1050) top out at ~1 Mbit/s. You need a CAN FD transceiver (TJA1044, TCAN334) for the data phase.
2. **Termination**: standard 120 Ω still applies, but stub lengths must be shorter at higher data rates.
3. **CRC mismatch**: mixing classic CAN and CAN FD nodes on the same bus requires each node to support both CRC variants or use ISO-mode FD which is backward compatible.

## Conclusion

CAN FD is a straightforward upgrade once the hardware and bit-timing configuration are correct. The biggest practical hurdle is transceiver selection and ensuring your driver correctly handles the BRS and ESI bits.
