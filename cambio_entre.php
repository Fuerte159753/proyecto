<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pedidosapp";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("La conexión falló: " . $conn->connect_error);
}
if (isset($_POST['pedido_id'])) {
    // Obtener el ID del pedido enviado desde Angular
    $pedido_id = $_POST['pedido_id'];

$sql = "UPDATE pedidos SET estado_pedido = 'entregado' WHERE pedido_id = $pedido_id";

if ($conn->query($sql) === TRUE) {
    echo "El estado del pedido se actualizó correctamente a entregado";
} else {
    echo "Error al actualizar el estado del pedido: " . $conn->error;
}echo "El pedido con ID $pedido_id ha sido marcado como entregado correctamente.";
} else {
    echo "No se ha recibido el ID del pedido correctamente.";
}
$conn->close();
?>