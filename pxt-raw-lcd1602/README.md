# raw-lcd1602

MakeCode extension for a raw parallel LCD1602 display on BBC micro:bit.

This is for standard HD44780-compatible 16x2 LCD displays **without** an I2C backpack.

## Default wiring

| LCD Pin | Name | micro:bit |
|---|---|---|
| 1 | VSS | GND |
| 2 | VDD | 3.3V |
| 3 | VO | GND or potentiometer middle pin |
| 4 | RS | P0 |
| 5 | RW | GND |
| 6 | E | P1 |
| 11 | D4 | P8 |
| 12 | D5 | P12 |
| 13 | D6 | P13 |
| 14 | D7 | P14 |
| 15 | A | 3.3V |
| 16 | K | GND |

Leave LCD pins 7-10 disconnected.

## Basic JavaScript example

```typescript
rawLCD1602.initDefault()
rawLCD1602.printLine("HELLO", 0)
rawLCD1602.printLine("MAKER LAB", 1)
```

## Notes

A 10k potentiometer is recommended for LCD contrast:

- one side to 3.3V
- middle to LCD pin 3 VO
- other side to GND

If you do not have a potentiometer, connect LCD pin 3 VO to GND temporarily.
