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

// Obtén los datos del pedidoId desde la solicitud POST
$pedidoId = $_POST['pedidoId'];

// Actualiza el estado del pedido en la base de datos
$sql = "UPDATE pedidos SET estado_pedido = 'cancelado' WHERE pedido_id = '$pedidoId'";

if ($conn->query($sql) === TRUE) {
    $response['success'] = true;
    $response['message'] = 'Pedido cancelado exitosamente';
} else {
    $response['success'] = false;
    $response['message'] = 'Error al cancelar el pedido: ' . $conn->error;
}

// Cierra la conexión a la base de datos
$conn->close();

// Envia la respuesta como JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
