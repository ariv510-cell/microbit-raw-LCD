// Raw Parallel LCD1602 MakeCode Extension
// For standard HD44780-compatible 16x2 LCD displays in 4-bit mode.

//% color="#1E90FF" icon="\uf26c" block="Raw LCD1602"
//% groups=['Setup', 'Display', 'Cursor', 'Advanced']
namespace rawLCD1602 {
    let rs = DigitalPin.P0
    let en = DigitalPin.P1
    let d4 = DigitalPin.P8
    let d5 = DigitalPin.P12
    let d6 = DigitalPin.P13
    let d7 = DigitalPin.P14
    let initialized = false

    function pulseEnable(): void {
        pins.digitalWritePin(en, 0)
        control.waitMicros(1)
        pins.digitalWritePin(en, 1)
        control.waitMicros(1)
        pins.digitalWritePin(en, 0)
        basic.pause(1)
    }

    function write4Bits(value: number): void {
        pins.digitalWritePin(d4, (value >> 0) & 1)
        pins.digitalWritePin(d5, (value >> 1) & 1)
        pins.digitalWritePin(d6, (value >> 2) & 1)
        pins.digitalWritePin(d7, (value >> 3) & 1)
        pulseEnable()
    }

    function send(value: number, mode: number): void {
        pins.digitalWritePin(rs, mode)
        write4Bits(value >> 4)
        write4Bits(value & 0x0F)
    }

    function command(value: number): void {
        send(value, 0)
    }

    function writeChar(value: number): void {
        send(value, 1)
    }

    function safeText(text: string, length: number): string {
        let out = text
        if (out.length > length) {
            out = out.substr(0, length)
        }
        while (out.length < length) {
            out = out + " "
        }
        return out
    }

    /**
     * Initialize raw LCD1602 in 4-bit mode.
     */
    //% block="initialize LCD RS %rsPin E %enPin D4 %d4Pin D5 %d5Pin D6 %d6Pin D7 %d7Pin"
    //% group="Setup"
    //% weight=100
    export function init(rsPin: DigitalPin, enPin: DigitalPin, d4Pin: DigitalPin, d5Pin: DigitalPin, d6Pin: DigitalPin, d7Pin: DigitalPin): void {
        rs = rsPin
        en = enPin
        d4 = d4Pin
        d5 = d5Pin
        d6 = d6Pin
        d7 = d7Pin

        basic.pause(50)
        pins.digitalWritePin(rs, 0)
        pins.digitalWritePin(en, 0)

        write4Bits(0x03)
        basic.pause(5)
        write4Bits(0x03)
        basic.pause(5)
        write4Bits(0x03)
        basic.pause(1)
        write4Bits(0x02)

        command(0x28) // 4-bit, 2 lines, 5x8 font
        command(0x0C) // display on, cursor off, blink off
        command(0x06) // entry mode, cursor moves right
        command(0x01) // clear display
        basic.pause(5)
        initialized = true
    }

    /**
     * Initialize with the Maker Lab default wiring: RS P0, E P1, D4 P8, D5 P12, D6 P13, D7 P14.
     */
    //% block="initialize LCD with default pins"
    //% group="Setup"
    //% weight=95
    export function initDefault(): void {
        init(DigitalPin.P0, DigitalPin.P1, DigitalPin.P8, DigitalPin.P12, DigitalPin.P13, DigitalPin.P14)
    }

    /** Clear the LCD screen. */
    //% block="clear LCD"
    //% group="Display"
    //% weight=90
    export function clear(): void {
        command(0x01)
        basic.pause(2)
    }

    /** Set cursor position. Row is 0 or 1. Column is 0 through 15. */
    //% block="set LCD cursor column %col row %row"
    //% group="Cursor"
    //% weight=80
    //% col.min=0 col.max=15 row.min=0 row.max=1
    export function setCursor(col: number, row: number): void {
        if (row < 0) row = 0
        if (row > 1) row = 1
        if (col < 0) col = 0
        if (col > 15) col = 15
        let rowOffsets = [0x00, 0x40]
        command(0x80 | (col + rowOffsets[row]))
    }

    /** Print text at the current cursor position. */
    //% block="LCD print %text"
    //% group="Display"
    //% weight=70
    export function print(text: string): void {
        for (let i = 0; i < text.length; i++) {
            writeChar(text.charCodeAt(i))
        }
    }

    /** Print text on a specific row, clearing the rest of that row. */
    //% block="LCD print line %text on row %row"
    //% group="Display"
    //% weight=85
    //% row.min=0 row.max=1
    export function printLine(text: string, row: number): void {
        setCursor(0, row)
        print(safeText(text, 16))
    }

    /** Turn display on. */
    //% block="LCD display on"
    //% group="Advanced"
    //% weight=50
    export function displayOn(): void {
        command(0x0C)
    }

    /** Turn display off. */
    //% block="LCD display off"
    //% group="Advanced"
    //% weight=49
    export function displayOff(): void {
        command(0x08)
    }

    /** Move cursor to home position. */
    //% block="LCD home"
    //% group="Cursor"
    //% weight=60
    export function home(): void {
        command(0x02)
        basic.pause(2)
    }
}
