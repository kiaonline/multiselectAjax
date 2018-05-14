<?php
$query = (isset($_POST['query']))? $_POST['query'] : false;
if(!$query) die('q param not found');

$data = array('Cheese','Tomatoes red','Tomatoes green','Mozzarella','Pepperoni','Onions','Pepper');

$matches  = preg_grep ('/^'. $query . '(\w+)/i', $data);

$out = array();
foreach($matches as $id => $match){
    $out[] = array('id'=>$id,'value'=>$match);
}

echo json_encode($out);
?>
