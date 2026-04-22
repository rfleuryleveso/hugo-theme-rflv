---
title: "First Steps with Rust on Bare-Metal ARM (no_std)"
date: 2024-01-18
description: "A minimal working example of a Rust no_std firmware project targeting a Cortex-M4, using RTIC and probe-rs for flashing and debugging."
tags: ["Rust", "ARM", "Cortex-M", "no_std", "RTIC", "embedded"]
category: "Firmware"
categories: ["firmware"]
---

Rust's ownership model and zero-cost abstractions make it compelling for embedded systems. Here is the fastest path to a working LED blink on a Cortex-M4 (STM32F4-based).

## Prerequisites

```bash
rustup target add thumbv7em-none-eabihf
cargo install probe-rs-tools --locked
```

## Project structure

```
blinky/
├── Cargo.toml
├── .cargo/config.toml
├── memory.x          # linker script with flash/RAM sizes
└── src/
    └── main.rs
```

## `Cargo.toml`

```toml
[package]
name = "blinky"
version = "0.1.0"
edition = "2021"

[dependencies]
cortex-m       = { version = "0.7", features = ["critical-section-single-core"] }
cortex-m-rt    = "0.7"
stm32f4xx-hal  = { version = "0.20", features = ["stm32f407"] }
panic-halt     = "0.2"

[profile.release]
opt-level = "z"
lto       = true
codegen-units = 1
```

## `src/main.rs`

```rust
#![no_std]
#![no_main]

use cortex_m_rt::entry;
use stm32f4xx_hal::{pac, prelude::*};

#[entry]
fn main() -> ! {
    let dp = pac::Peripherals::take().unwrap();
    let gpiod = dp.GPIOD.split();
    let mut led = gpiod.pd15.into_push_pull_output();

    let rcc = dp.RCC.constrain();
    let clocks = rcc.cfgr.freeze();
    let mut delay = dp.TIM2.delay_ms(&clocks);

    loop {
        led.toggle();
        delay.delay_ms(500u32);
    }
}
```

## Flash and debug

```bash
cargo build --release
probe-rs run --chip STM32F407VGTx target/thumbv7em-none-eabihf/release/blinky
```

{{< note type="note" >}}
`probe-rs` replaces `openocd` + `gdb` for most day-to-day workflows and has excellent RTT (Real-Time Transfer) support for `defmt` logging.
{{< /note >}}

## Next steps

- Replace the busy-wait with **RTIC** for interrupt-driven tasks
- Add `defmt` + `defmt-rtt` for structured logging over SWD
- Use `embassy` if you need async/await concurrency
