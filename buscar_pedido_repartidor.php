<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pedidosapp";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    $error = array('error' => 'Error de conexión: ' . $conn->connect_error);
    http_response_code(500); // Código de error de servidor
    echo json_encode($error);
    exit(); // Detener la ejecución del script
}

$repartidorId = $_GET['repartidorId'];

// Primera consulta para obtener las localidades del repartidor
$queryLocalidades = "
    SELECT DISTINCT rt.localidad
    FROM repartidores r, rutas rt
    WHERE r.repartidor_id = $repartidorId
    AND rt.repartidor_id = $repartidorId;
";

$resultLocalidades = $conn->query($queryLocalidades);

if ($resultLocalidades === false) {
    $error = array('error' => 'Error en la consulta SQL de localidades: ' . $conn->error);
    http_response_code(500); // Código de error de servidor
    echo json_encode($error);
    exit();
}

$localidades = array();
while ($row = $resultLocalidades->fetch_assoc()) {
    $localidades[] = $row['localidad'];
}

// Segunda consulta para obtener los cliente_id basados en las localidades del repartidor
$queryClientes = "
    SELECT cliente_id
    FROM clientes
    WHERE localidad IN ('" . implode("', '", $localidades) . "');
";

$resultClientes = $conn->query($queryClientes);

if ($resultClientes === false) {
    $error = array('error' => 'Error en la consulta SQL de clientes: ' . $conn->error);
    http_response_code(500); // Código de error de servidor
    echo json_encode($error);
    exit();
}

$clienteIds = array();
while ($row = $resultClientes->fetch_assoc()) {
    $clienteIds[] = $row['cliente_id'];
}

// Tercera consulta para obtener los pedidos basados en los cliente_id obtenidos y estado 'en espera'
$queryPedidos = "
    SELECT pedido_id, cliente_id, direccion
    FROM pedidos
    WHERE cliente_id IN ('" . implode("', '", $clienteIds) . "')
    AND estado_pedido = 'en espera';
";
$resultPedidos = $conn->query($queryPedidos);

if ($resultPedidos->num_rows > 0) {
    $output = array();
    while ($row = $resultPedidos->fetch_assoc()) {
        $clienteId = $row['cliente_id'];
        $pedidoId = $row['pedido_id'];
        $direccion = $row['direccion'];

        // Consulta para obtener información adicional del pedido desde detallespedido
        $queryDetallesPedido = "
            SELECT categoria, subcategoria, descripcion
            FROM detallespedido
            WHERE pedido_id = '$pedidoId';
        ";

        $resultDetallesPedido = $conn->query($queryDetallesPedido);
        $detallesPedido = array();
        while ($detalle = $resultDetallesPedido->fetch_assoc()) {
            $detallesPedido[] = $detalle;
        }

        // Consulta para obtener nombre, apellido, telefono y localidad del cliente
        $queryClienteInfo = "
            SELECT nombre, apellido, telefono, localidad
            FROM clientes
            WHERE cliente_id = '$clienteId';
        ";

        $resultClienteInfo = $conn->query($queryClienteInfo);
        $clienteData = $resultClienteInfo->fetch_assoc();
        $clienteInfo = array(
            'nombre' => $clienteData['nombre'],
            'apellido' => $clienteData['apellido'],
            'telefono' => $clienteData['telefono'],
            'localidad' => $clienteData['localidad']
        );
        
        // Estructurar los detalles del pedido similar a los datos del cliente
        $detallesPedidoArray = array();
        foreach ($detallesPedido as $detalle) {
            $detallesPedidoArray[] = array(
                'categoria' => $detalle['categoria'],
                'subcategoria' => $detalle['subcategoria'],
                'descripcion' => $detalle['descripcion']
            );
        }

        // Estructurar la información del pedido para el JSON de salida
        $pedidoInfo = array(
            'pedido_id' => $pedidoId,
            'direccion' => $direccion,
            'cliente' => $clienteInfo,
            'detalles_pedido' => $detallesPedidoArray // Agregar detalles del pedido estructurados al array
        );

        $output[] = $pedidoInfo;
    }
    echo json_encode($output);
} else {
    echo json_encode(array());
}

$conn->close();
?>