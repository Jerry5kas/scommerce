<?php
$conn = new mysqli('127.0.0.1', 'root', '', 'scommerce');
if ($conn->connect_error) {
    die('ERROR: ' . $conn->connect_error);
}
$result = $conn->query('SHOW TABLES');
echo "Tables in scommerce:\n";
while($row = $result->fetch_row()) {
    echo "  - " . $row[0] . "\n";
}
$conn->close();
