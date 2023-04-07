<?php
//récupère la liste des conférences
$directory = '/var/www/html/samszo/conf_errance/';//getcwd();
$webPath = "https://samszo.univ-paris8.fr/conf_errance/";
//$directory = '/Users/samszo/Sites/samszo/conf_errance/';
//$webPath = "http://localhost/samszo/conf_errance/";
$scanned_directory = array_diff(scandir($directory), array('..', '.'));
$confs = array();
foreach ($scanned_directory as $c) {
    //récupère le svg
    $svgPath = glob($directory.$c.'/*.{svg}', GLOB_BRACE)[0];
    if($svgPath){
        $c=array(
        'urlSVG' => $webPath.$c."/".pathinfo($svgPath)['filename'].".svg",
        'urlSlide' => $webPath.$c."/slide.html",
        'urlConf' => $webPath.$c."/index.html",
        'diapos' =>[]
        );
        $c['infos']=getConfInfos($c['urlConf']);        
        $xml = simplexml_load_file($c['urlSVG']);
        if($xml){
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
}
echo json_encode($confs);

function file_get_contents_curl($url){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}
function getConfInfos($url){
    $html = file_get_contents_curl($url);
    preg_match('/<title>(.+)<\/title>/',$html,$matches);
    $infos['title'] = $matches[1];
    return $infos;     
}

?>
