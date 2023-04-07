<?php
require 'vendor/autoload.php';
//charge la vidéo
$urlVideo = "03-seminaire-arcanes-2021-03-05.mp4";//'01-seminaire-arcanes-2021-02-05.mp4'
$ffmpeg = FFMpeg\FFMpeg::create();
$video = $ffmpeg->open($urlVideo);
//récupérère les propriétés
$ffprobe = FFMpeg\FFProbe::create();
$format = $ffprobe
    ->format($urlVideo); // extracts file informations
$stream = $ffprobe
    ->streams($urlVideo) // extracts streams informations
    ->videos()                      // filters video streams
    ->first(); 
$width = $stream->get('width');              
$height = $stream->get('height');              
$duration = $format->get('duration');             // returns the duration property
echo $width.' - '.$height.' - '.$duration;

/*redimensionne la vidéo
$video
    ->filters()
    ->resize(new FFMpeg\Coordinate\Dimension(320, 240))
    ->synchronize();
*/

/*extraction de 10 images aléatoires    
for ($i=0; $i < 10; $i++) { 
    $t = random_int(0, $duration);
    $video
        ->frame(FFMpeg\Coordinate\TimeCode::fromSeconds($t))
        ->save('img/frame-'.$t.'.jpg');
}
*/

//extraction d'un clip aléatoire
$tDur = 6;
$tDeb = random_int(0, $duration-$tDur);
$clip = $video->clip(FFMpeg\Coordinate\TimeCode::fromSeconds($tDeb), FFMpeg\Coordinate\TimeCode::fromSeconds($tDur));
$clip->save(new FFMpeg\Format\Video\Ogg(), 'video/video_'.$tDeb.'-'.$tDur.'.ogg');

/*extraction du son
// Set an audio format
$audio_format = new FFMpeg\Format\Audio\Mp3();
// Extract the audio into a new file as mp3
$video->save($audio_format, 'audio/audio_'.$tDeb.'-'.$tDur.'.mp3');
// Set the audio file
$audio = $ffmpeg->open( 'audio/audio_'.$tDeb.'-'.$tDur.'.mp3' );
// Create the waveform
$waveform = $audio->waveform();
$waveform->save( 'wave/waveform_'.$tDeb.'-'.$tDur.'.png' );
*/

//enregistre une image pour connaitre les coordonnées
$clip
    ->frame(FFMpeg\Coordinate\TimeCode::fromSeconds($tDeb))//attention le timecode du clip ne change pas
    ->save('img/frag-'.$tDeb.'-'.$tDur.'.jpg');

//découpe la vidéo
//point qui bouge
//$video->filters()->crop(new FFMpeg\Coordinate\Point("t*100", 0, true), new FFMpeg\Coordinate\Dimension(100, 100));
//point fixe
//POLYGON ((16.246615 448, 16.246615 646, 370.446351 646, 370.446351 448, 16.246615 448))
//extraction des miniatures de webcam
echo '<video controls width="250">
<source src="video/video_'.$tDeb.'-'.$tDur.'.ogg">
Votre navigateur ne marche pas.
</video>';
$margeDroiteGauche = 16;
$margeHautBas = 54;
$nbCol = 4;
$nbRow = 4; 
$w = ($width-($margeDroiteGauche*2))/$nbCol;//+10; 
$h = ($height-($margeHautBas*2))/$nbRow; 
for ($c=0; $c < $nbCol; $c++) { 
    for ($r=0; $r < $nbRow; $r++) { 
        $x = $margeDroiteGauche+($w*$c);
        $y = $margeHautBas+($h*$r);
        $clip->filters()->crop(new FFMpeg\Coordinate\Point($x, $y, true), new FFMpeg\Coordinate\Dimension($w, $h));
        $clip->save(new FFMpeg\Format\Video\Ogg(), 'video/video'.$tDeb.'-'.$tDur.'_frag'.$c.'-'.$r.'.ogg');
        echo '<video controls width="250">
        <source src="video/video'.$tDeb.'-'.$tDur.'_frag'.$c.'-'.$r.'.ogg">
        Votre navigateur ne marche pas.
        </video>';
    }
}

