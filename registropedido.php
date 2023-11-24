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
    die("Conexión fallida: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"));

    // Obtener datos del formulario
    $categoria = $data->categoria;
    $subcategoria = $data->subcategoria;
    $pedidoTexto1 = $data->pedidoTexto1;
    $direccion = $data->direccion;
    $clienteId = $data->clienteId;

    // Obtener el último pedido_id y detalle_id
    $sqlUltimoPedido = "SELECT MAX(pedido_id) AS ultimoPedido FROM pedidos";
    $resultUltimoPedido = $conn->query($sqlUltimoPedido);
    $rowPedido = $resultUltimoPedido->fetch_assoc();
    $ultimoPedidoId = $rowPedido["ultimoPedido"] + 1;

    $sqlUltimoDetalle = "SELECT MAX(detalle_id) AS ultimoDetalle FROM detallespedido";
    $resultUltimoDetalle = $conn->query($sqlUltimoDetalle);
    $rowDetalle = $resultUltimoDetalle->fetch_assoc();
    $ultimoDetalleId = $rowDetalle["ultimoDetalle"] + 1;

    // Insertar en la tabla pedidos
    $fechaPedido = date("Y-m-d"); // Obtener fecha actual
    $estadoPedido = "en espera";
    $sqlPedido = "INSERT INTO pedidos (pedido_id, cliente_id, fecha_pedido, direccion, estado_pedido) 
                  VALUES ('$ultimoPedidoId', '$clienteId', '$fechaPedido', '$direccion', '$estadoPedido')";
    $resultPedido = $conn->query($sqlPedido);

    if ($resultPedido) {
        // Insertar en la tabla detallespedido
        $sqlDetalle = "INSERT INTO `detallespedido`(`detalle_id`, `pedido_id`, `categoria`, `subcategoria`, `descripcion`) VALUES 
                       ('$ultimoDetalleId', '$ultimoPedidoId', '$categoria', '$subcategoria', '$pedidoTexto1')";
        $resultDetalle = $conn->query($sqlDetalle);
    
        if ($resultDetalle) {
            echo json_encode(array("mensaje" => "registrado"));
        } else {
            $error = array(
                "error" => "Error al registrar los detalles del pedido",
                "detalle_id" => $ultimoDetalleId,
                "pedido_id" => $ultimoPedidoId,
                "categoria" => $categoria,
                "subcategoria" => $subcategoria,
                "descripcion" => $pedidoTexto1
            );
            echo json_encode($error);
        }
    } else {
        echo json_encode(array("error" => "Error al registrar el pedido"));
    }
}

$conn->close();
?>