# Lógica de Negocio

Reglas de negocio y pseudocódigo para el Sistema de Control Financiero.

## Modelo Conceptual

### Separación Estricta de Conceptos

```
MOVIMIENTO (qué pasó)
    ↓
CATEGORÍA (por qué pasó)
    ↓
CUENTA (dónde está el dinero)
```

**NUNCA mezclar estos conceptos.**

## Tipos de Movimientos

### 1. INGRESO
Dinero que entra al negocio.

**Reglas:**
- Solo requiere `cuenta_destino_id`
- `cuenta_origen_id` debe ser NULL
- Requiere `categoria_id` de tipo 'ingreso'
- Suma al saldo de la cuenta destino
- Cuenta para el cálculo de utilidades

**Ejemplos:**
- Pago de cliente por servicio
- Venta de productos
- Otros ingresos

### 2. EGRESO
Dinero que sale del negocio.

**Reglas:**
- Solo requiere `cuenta_origen_id`
- `cuenta_destino_id` debe ser NULL
- Requiere `categoria_id` de tipo 'egreso'
- Resta del saldo de la cuenta origen
- Cuenta para el cálculo de utilidades

**Ejemplos:**
- Pago de nómina
- Compra de insumos
- Pago de servicios públicos
- Arriendo

### 3. TRANSFERENCIA
Movimiento de dinero entre cuentas internas.

**Reglas:**
- Requiere ambas: `cuenta_origen_id` y `cuenta_destino_id`
- Las cuentas deben ser diferentes
- `categoria_id` es opcional (puede ser NULL)
- NO afecta el cálculo de utilidades
- Resta de cuenta origen, suma a cuenta destino

**Ejemplos:**
- Transferencia de efectivo a banco
- Movimiento entre cuentas bancarias
- Retiro de banco a caja

## Pseudocódigo: Crear Movimiento

```python
def crear_movimiento(tipo, monto, fecha, cuenta_origen, cuenta_destino, categoria, descripcion, user_id):
    # Validaciones generales
    if monto <= 0:
        raise Error("El monto debe ser mayor a cero")
    
    if not fecha:
        fecha = HOY
    
    # Validaciones por tipo
    if tipo == "ingreso":
        if cuenta_origen is not None:
            raise Error("Un ingreso no puede tener cuenta origen")
        
        if cuenta_destino is None:
            raise Error("Un ingreso debe tener cuenta destino")
        
        if categoria is None:
            raise Error("Un ingreso debe tener categoría")
        
        if categoria.tipo != "ingreso":
            raise Error("La categoría debe ser de tipo ingreso")
    
    elif tipo == "egreso":
        if cuenta_destino is not None:
            raise Error("Un egreso no puede tener cuenta destino")
        
        if cuenta_origen is None:
            raise Error("Un egreso debe tener cuenta origen")
        
        if categoria is None:
            raise Error("Un egreso debe tener categoría")
        
        if categoria.tipo != "egreso":
            raise Error("La categoría debe ser de tipo egreso")
    
    elif tipo == "transferencia":
        if cuenta_origen is None or cuenta_destino is None:
            raise Error("Una transferencia debe tener ambas cuentas")
        
        if cuenta_origen == cuenta_destino:
            raise Error("Las cuentas deben ser diferentes")
        
        # Categoría es opcional para transferencias
    
    else:
        raise Error("Tipo de movimiento inválido")
    
    # Verificar que las cuentas estén activas
    if cuenta_origen and not cuenta_origen.activa:
        raise Error("La cuenta origen no está activa")
    
    if cuenta_destino and not cuenta_destino.activa:
        raise Error("La cuenta destino no está activa")
    
    # Crear el movimiento
    movimiento = INSERT INTO movimientos (
        tipo = tipo,
        monto = monto,
        fecha = fecha,
        cuenta_origen_id = cuenta_origen?.id,
        cuenta_destino_id = cuenta_destino?.id,
        categoria_id = categoria?.id,
        descripcion = descripcion,
        created_by = user_id,
        anulado = false
    )
    
    return movimiento
```

## Pseudocódigo: Calcular Saldo de Cuenta

```python
def calcular_saldo_cuenta(cuenta_id):
    saldo = 0
    
    # Obtener todos los movimientos no anulados de esta cuenta
    movimientos = SELECT * FROM movimientos 
                  WHERE (cuenta_origen_id = cuenta_id OR cuenta_destino_id = cuenta_id)
                  AND anulado = false
    
    for movimiento in movimientos:
        if movimiento.tipo == "ingreso" and movimiento.cuenta_destino_id == cuenta_id:
            # Ingreso: suma al saldo
            saldo += movimiento.monto
        
        elif movimiento.tipo == "egreso" and movimiento.cuenta_origen_id == cuenta_id:
            # Egreso: resta del saldo
            saldo -= movimiento.monto
        
        elif movimiento.tipo == "transferencia":
            if movimiento.cuenta_destino_id == cuenta_id:
                # Transferencia entrante: suma
                saldo += movimiento.monto
            elif movimiento.cuenta_origen_id == cuenta_id:
                # Transferencia saliente: resta
                saldo -= movimiento.monto
    
    return saldo
```

## Pseudocódigo: Anular Movimiento

```python
def anular_movimiento(movimiento_id, motivo, user_id):
    # Verificar que el movimiento existe
    movimiento = SELECT * FROM movimientos WHERE id = movimiento_id
    
    if not movimiento:
        raise Error("Movimiento no encontrado")
    
    # Verificar que no esté ya anulado
    if movimiento.anulado:
        raise Error("El movimiento ya está anulado")
    
    # Verificar permisos (solo admin puede anular)
    user = SELECT * FROM profiles WHERE id = user_id
    if user.rol != "admin":
        raise Error("Solo los administradores pueden anular movimientos")
    
    # Anular el movimiento (NO eliminar)
    UPDATE movimientos
    SET 
        anulado = true,
        fecha_anulacion = NOW(),
        motivo_anulacion = motivo
    WHERE id = movimiento_id
    
    return true
```

## Pseudocódigo: Calcular Reporte de Período

```python
def calcular_reporte_periodo(fecha_inicio, fecha_fin):
    # Obtener movimientos del período (no anulados)
    movimientos = SELECT * FROM movimientos
                  WHERE fecha BETWEEN fecha_inicio AND fecha_fin
                  AND anulado = false
    
    total_ingresos = 0
    total_egresos = 0
    
    for movimiento in movimientos:
        if movimiento.tipo == "ingreso":
            total_ingresos += movimiento.monto
        elif movimiento.tipo == "egreso":
            total_egresos += movimiento.monto
        # Las transferencias NO se cuentan
    
    resultado = total_ingresos - total_egresos
    
    return {
        "ingresos": total_ingresos,
        "egresos": total_egresos,
        "resultado": resultado
    }
```

## Pseudocódigo: Exportar Movimientos a CSV

```python
def exportar_movimientos_csv(fecha_inicio, fecha_fin, cuenta_id=None, categoria_id=None):
    # Construir query con filtros
    query = """
        SELECT 
            fecha,
            tipo,
            monto,
            cuenta_origen_nombre,
            cuenta_destino_nombre,
            categoria_nombre,
            descripcion,
            CASE WHEN anulado THEN 'ANULADO' ELSE 'ACTIVO' END as estado
        FROM vista_movimientos_completos
        WHERE fecha BETWEEN ? AND ?
    """
    
    params = [fecha_inicio, fecha_fin]
    
    if cuenta_id:
        query += " AND (cuenta_origen_id = ? OR cuenta_destino_id = ?)"
        params.extend([cuenta_id, cuenta_id])
    
    if categoria_id:
        query += " AND categoria_id = ?"
        params.append(categoria_id)
    
    query += " ORDER BY fecha DESC, created_at DESC"
    
    movimientos = EXECUTE(query, params)
    
    # Generar CSV
    csv = "Fecha,Tipo,Monto,Cuenta Origen,Cuenta Destino,Categoría,Descripción,Estado\n"
    
    for mov in movimientos:
        csv += f"{mov.fecha},{mov.tipo},{mov.monto},"
        csv += f"{mov.cuenta_origen_nombre or '-'},"
        csv += f"{mov.cuenta_destino_nombre or '-'},"
        csv += f"{mov.categoria_nombre or '-'},"
        csv += f'"{mov.descripcion or ''}",{mov.estado}\n'
    
    return csv
```

## Reglas de Validación

### Montos
- Siempre positivos (> 0)
- Máximo 2 decimales
- Formato: `DECIMAL(12, 2)` (hasta 999,999,999.99)

### Fechas
- No pueden ser futuras
- Por defecto: fecha actual
- Formato: `DATE` (YYYY-MM-DD)

### Cuentas
- Deben estar activas para crear movimientos
- No se pueden eliminar si tienen movimientos
- Solo se desactivan (soft delete)

### Categorías
- Deben estar activas para crear movimientos
- Deben coincidir con el tipo de movimiento
- Soportan jerarquía (parent_id)

### Movimientos
- Son inmutables (no se editan)
- Solo se anulan con motivo
- La anulación requiere rol admin
- No se pueden anular movimientos ya anulados

## Cálculos Importantes

### Saldo Total
```
Saldo Total = Suma de saldos de todas las cuentas activas
```

### Utilidad del Período
```
Utilidad = Total Ingresos - Total Egresos
(Las transferencias NO se cuentan)
```

### Saldo de Cuenta
```
Saldo = 
  + Ingresos a esta cuenta
  - Egresos desde esta cuenta
  + Transferencias entrantes
  - Transferencias salientes
```

## Flujos de Usuario

### Crear Ingreso
1. Usuario selecciona tipo: "Ingreso"
2. Ingresa monto
3. Selecciona cuenta destino (dónde entra el dinero)
4. Selecciona categoría de ingreso
5. Opcionalmente agrega descripción
6. Sistema valida y crea movimiento
7. Saldo de cuenta destino se actualiza automáticamente

### Crear Egreso
1. Usuario selecciona tipo: "Egreso"
2. Ingresa monto
3. Selecciona cuenta origen (de dónde sale el dinero)
4. Selecciona categoría de egreso
5. Opcionalmente agrega descripción
6. Sistema valida y crea movimiento
7. Saldo de cuenta origen se actualiza automáticamente

### Crear Transferencia
1. Usuario selecciona tipo: "Transferencia"
2. Ingresa monto
3. Selecciona cuenta origen
4. Selecciona cuenta destino
5. Opcionalmente agrega descripción
6. Sistema valida que las cuentas sean diferentes
7. Sistema crea movimiento
8. Saldos de ambas cuentas se actualizan automáticamente

### Anular Movimiento (solo admin)
1. Admin busca el movimiento
2. Selecciona "Anular"
3. Ingresa motivo de anulación
4. Sistema marca movimiento como anulado
5. Saldos se recalculan automáticamente (excluyendo el movimiento anulado)
