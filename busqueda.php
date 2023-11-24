<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pedidosapp";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$clienteId = $_GET['cliente_id'];

$sql_pedidos = "SELECT pedido_id, fecha_pedido, estado_pedido FROM pedidos WHERE cliente_id = $clienteId";
$result_pedidos = $conn->query($sql_pedidos);

$response = array();

if ($result_pedidos->num_rows > 0) {
    while ($row_pedido = $result_pedidos->fetch_assoc()) {
        $pedido_id = $row_pedido['pedido_id'];

        $sql_detalles = "SELECT categoria, subcategoria, descripcion FROM detallespedido WHERE pedido_id = $pedido_id";
        $result_detalles = $conn->query($sql_detalles);

        $detalles = array();
        while ($row_detalle = $result_detalles->fetch_assoc()) {
            $detalles[] = $row_detalle;
        }
        $row_pedido['detalles'] = $detalles;
        $response[] = $row_pedido;
    }

    echo json_encode($response);
} else {
    echo "Realiza tu primer pedido con nosotros";
}

$conn->close();
?>