<?php
header("Access-Control-Allow-Origin: *");
// Otros encabezados para permitir ciertos métodos HTTP y encabezados
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pedidosapp";
// Conéctate a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);
// Verifica la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
if (isset($_GET['pedido_id'])) {
    $pedidoId = $_GET['pedido_id'];
    $sql = "UPDATE pedidos SET estado_pedido = 'cancelado' WHERE pedido_id = '$pedidoId'";

    if ($conn->query($sql) == TRUE) {
        $response['success'] = true;
        $response['message'] = 'Pedido cancelado exitosamente';
    } else {
        $response['success'] = false;
        $response['message'] = 'Error al cancelar el pedido: ' . $conn->error;
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Error: No se proporcionó el ID del pedido en la URL.';
}
$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>