import { format as dateFnsFormat, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Formatea un número como moneda colombiana (COP)
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

/**
 * Formatea una fecha en formato legible
 */
export function formatDate(date: string | Date, formatStr: string = 'PP'): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return dateFnsFormat(dateObj, formatStr, { locale: es })
}

/**
 * Formatea una fecha en formato corto (dd/MM/yyyy)
 */
export function formatDateShort(date: string | Date): string {
    return formatDate(date, 'dd/MM/yyyy')
}

/**
 * Formatea una fecha con hora
 */
export function formatDateTime(date: string | Date): string {
    return formatDate(date, 'dd/MM/yyyy HH:mm')
}

/**
 * Obtiene el primer día del mes actual
 */
export function getFirstDayOfMonth(): string {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
}

/**
 * Obtiene el día actual
 */
export function getToday(): string {
    return new Date().toISOString().split('T')[0]
}

/**
 * Parsea un número desde un string, removiendo caracteres no numéricos
 */
export function parseNumber(value: string): number {
    const cleaned = value.replace(/[^\d.-]/g, '')
    return parseFloat(cleaned) || 0
}
