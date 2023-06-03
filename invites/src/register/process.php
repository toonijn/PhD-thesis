<?php

$result = array("success" => false, "message" => "");

if (isset($_POST['name']) && isset($_POST['attendends']) && isset($_POST['comment'])) {
    // check if name has less than 100 characters and comment has less than 1000 characters and attendends is numeric
    if (strlen($_POST['name']) > 200 || strlen($_POST['comment']) > 1500 || !is_numeric($_POST['attendends'])) {
        $result["message"] = "Input variables do not have the required format.";
    } else {
        $data = json_encode(array(
            "name" => $_POST['name'],
            "attendends" => $_POST['attendends'],
            "comment" => $_POST['comment']
        ));
        file_put_contents('submissions.txt', $data . PHP_EOL, FILE_APPEND);
        $result["success"] = true;
    }
} else {
    $result["message"] = "Not all input variables are set.";
}

echo json_encode($result);
