<?php
//récupère la liste des conférences
$directory = '/var/www/html/samszo/conf_errance/';//getcwd();
$webPath = "https://samszo.univ-paris8.fr/conf_errance/";
$scanned_directory = array_diff(scandir($directory), array('..', '.'));
$confs = array();
foreach ($scanned_directory as $c) {
    //récupère le svg
    $svgPath = glob($directory.$c.'/*.{svg}', GLOB_BRACE)[0];
    if($svgPath){
        $c=array(
        'urlSVG' => $webPath.$c."/".pathinfo($svgPath)['filename'].".svg",
        'urlSlide' => $webPath.$c."/slide.html",
        'diapos' =>[]
        );
        $xml = simplexml_load_file($c['urlSVG']);
        $xml->registerXPathNamespace('svg', 'http://www.w3.org/2000/svg');
        //récupère les diapos
        $result = $xml->xpath('//svg:rect');
        foreach ($result as $node) {
            $id = $node->attributes()['id']->__toString();
            if(substr($id,0,6)=='slide_'){
                $c['diapos'][]=$id;
            }        
        }
        if(count($c['diapos'])){
            $confs[]=$c;
        }
    }
}
echo json_encode($confs);
?>
