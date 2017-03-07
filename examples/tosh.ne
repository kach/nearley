
line -> thing {% id %}

thing -> block {% id %}
       | r_parens {% id %}
       | b_parens {% id %}

n -> n4 {% id %}

sb -> join {% id %}
    | n4 {% id %}
    | s0 {% id %}

b -> b8 {% id %}

c -> r_parens {% id %}
   | c0 {% id %}

r_parens -> "(" _ r_value _ ")" {% d => d[2] %}

r_value -> join {% id %}
         | n4 {% id %}

b_parens -> "<" _ b8 _ ">" {% d => d[2] %}

predicate -> simple_predicate {% id %}

join -> "join" __ jpart __ jpart {% d => ["concatenate:with:", d[2], d[4]] %}

jpart -> s0 {% id %}
       | "_" {% d => "" %}
       | join {% id %}
       | r_parens {% id %}
       | b_parens {% id %}

predicate -> "touching" __ "color" __ c _ "?" {% d => ["touchingColor:", d[4]] %}
           | "color" __ c __ "is" __ "touching" __ c _ "?" {% d => ["color:sees:", d[2], d[8]] %}

b8 -> b_and {% id %}
    | b_or {% id %}
    | b7 {% id %}

b_and -> b_and __ "and" __ b7 {% d => ["&", d[0], d[4]] %}
       | b7 __ "and" __ b7 {% d => ["&", d[0], d[4]] %}

b_or -> b_or __ "or" __ b7 {% d => ["|", d[0], d[4]] %}
      | b7 __ "or" __ b7 {% d => ["|", d[0], d[4]] %}

b7 -> "not" __ b7 {% d => ["not", d[2]] %}
    | b6 {% id %}

b6 -> sb _ "<" _ sb {% d => ["<", d[0], d[4]] %}
    | sb _ ">" _ sb {% d => [">", d[0], d[4]] %}
    | sb _ "=" _ sb {% d => ["=", d[0], d[4]] %}
    | m_list __ "contains" __ sb _ "?" {% d => ["list:contains:", d[0], d[4]] %}
    | predicate {% id %}
    | b2 {% id %}

b2 -> b_parens {% id %}
    | b0 {% id %}

n4 -> n4 _ "+" _ n3 {% d => ["+", d[0], d[4]] %}
    | n4 _ "-" _ n3 {% d => ["-", d[0], d[4]] %}
    | n3 {% id %}

n3 -> n3 _ "*" _ n2 {% d => ["*", d[0], d[4]] %}
    | n3 _ "/" _ n2 {% d => ["/", d[0], d[4]] %}
    | n3 _ "mod" _ n2 {% d => ["%", d[0], d[4]] %}
    | n2 {% id %}

n2 -> "round" __ n2 {% d => ["rounded", d[2]] %}
    | m_mathOp __ "of" __ n2 {% d => ["computeFunction:of:", d[0], d[4]] %}
    | "pick" __ "random" __ n4 __ "to" __ n2 {% d => ["randomFrom:to:", d[4], d[8]] %}
    | m_attribute __ "of" __ m_spriteOrStage {% d => ["getAttribute:of:", d[0], d[4]] %}
    | "distance" __ "to" __ m_spriteOrMouse {% d => ["distanceTo:", d[4]] %}
    | "length" __ "of" __ s2 {% d => ["stringLength:", d[4]] %}
    | "letter" __ n __ "of" __ s2 {% d => ["letter:of:", d[2], d[6]] %}
    | n1 {% id %}

n1 -> simple_reporter {% id %}
    | r_parens {% id %}
    | b_parens {% id %}
    | n0 {% id %}

s2 -> s0 {% id %}
    | n1 {% id %}

n0 -> "-" _ number {% d => -d[2] %}
    | number {% d => d[0] %}
    | "_" {% d => 0 %}

s0 -> string {% id %}

b0 -> "<>" {% d => false %}

c0 -> color {% id %}

_greenFlag -> "flag"
            | "green" __ "flag"

_turnLeft -> "ccw"
           | "left"

_turnRight -> "cw"
            | "right"

c0 -> "red" {% id %}
    | "orange" {% id %}
    | "yellow" {% id %}
    | "green" {% id %}
    | "blue" {% id %}
    | "purple" {% id %}
    | "black" {% id %}
    | "white" {% id %}
    | "pink" {% id %}
    | "brown" {% id %}

m_attribute -> "x" __ "position" {% d => "x position" %}
             | "y" __ "position" {% d => "y position" %}
             | "direction" {% id %}
             | "costume" __ "#" {% d => "costume #" %}
             | "costume" __ "name" {% d => "costume name" %}
             | "backdrop" __ "#" {% d => "backdrop #" %}
             | "backdrop" __ "name" {% d => "backdrop name" %}
             | "size" {% id %}
             | "volume" {% id %}
             | "_" {% d => "" %}

m_backdrop -> jpart {% id %}
            | "_" {% d => "" %}

m_broadcast -> jpart {% id %}
             | "_" {% d => "" %}

m_costume -> jpart {% id %}
           | "_" {% d => "" %}

m_effect -> "color" {% id %}
          | "fisheye" {% id %}
          | "whirl" {% id %}
          | "pixelate" {% id %}
          | "mosaic" {% id %}
          | "brightness" {% id %}
          | "ghost" {% id %}
          | "_" {% d => "" %}

m_key -> "space" {% id %}
       | "up" __ "arrow" {% d => "up arrow" %}
       | "down" __ "arrow" {% d => "down arrow" %}
       | "right" __ "arrow" {% d => "right arrow" %}
       | "left" __ "arrow" {% d => "left arrow" %}
       | "any" {% id %}
       | [a-z0-9] {% id %}
       | "_" {% d => "" %}

m_list -> ListName {% id %}
        | "_" {% d => "" %}

m_location -> jpart {% id %}
            | "mouse-pointer" {% d => "_mouse_" %}
            | "random" __ "position" {% d => "_random_" %}
            | "_" {% d => "" %}

m_mathOp -> "abs" {% id %}
          | "floor" {% id %}
          | "ceiling" {% id %}
          | "sqrt" {% id %}
          | "sin" {% id %}
          | "cos" {% id %}
          | "tan" {% id %}
          | "asin" {% id %}
          | "acos" {% id %}
          | "atan" {% id %}
          | "ln" {% id %}
          | "log" {% id %}
          | "e" _ "^" {% d => "e ^" %}
          | "10" _ "^" {% d => "10 ^" %}
          | "_" {% d => "" %}

m_rotationStyle -> "left-right" {% id %}
                 | "don't" __ "rotate" {% d => "don't rotate" %}
                 | "all" __ "around" {% d => "all around" %}
                 | "_" {% d => "" %}

m_scene -> jpart {% id %}
         | "_" {% d => "" %}

m_sound -> jpart {% id %}
         | "_" {% d => "" %}

m_spriteOnly -> jpart {% id %}
              | "myself" {% d => "_myself_" %}
              | "_" {% d => "" %}

m_spriteOrMouse -> jpart {% id %}
                 | "mouse-pointer" {% d => "_mouse_" %}
                 | "_" {% d => "" %}

m_spriteOrStage -> jpart {% id %}
                 | "Stage" {% d => "_stage_" %}
                 | "_" {% d => "" %}

m_stageOrThis -> "Stage" {% d => "_stage_" %}
               | "this" __ "sprite" {% d => "this sprite" %}
               | "_" {% d => "" %}

m_stop -> "all" {% id %}
        | "this" __ "script" {% d => "this script" %}
        | "other" __ "scripts" __ "in" __ "sprite" {% d => "other scripts in sprite" %}
        | "_" {% d => "" %}

m_timeAndDate -> "year" {% id %}
               | "month" {% id %}
               | "date" {% id %}
               | "day" __ "of" __ "week" {% d => "day of week" %}
               | "hour" {% id %}
               | "minute" {% id %}
               | "second" {% id %}
               | "_" {% d => "" %}

m_touching -> jpart {% id %}
            | "mouse-pointer" {% d => "_mouse_" %}
            | "edge" {% d => "_edge_" %}
            | "_" {% d => "" %}

m_triggerSensor -> "loudness" {% id %}
                 | "timer" {% id %}
                 | "video" __ "motion" {% d => "video motion" %}
                 | "_" {% d => "" %}

m_var -> VariableName {% id %}
       | "_" {% d => "" %}

m_varName -> VariableName {% id %}
           | "_" {% d => "" %}

m_videoMotionType -> "motion" {% id %}
                   | "direction" {% id %}
                   | "_" {% d => "" %}

m_videoState -> "off" {% id %}
              | "on" {% id %}
              | "on-flipped" {% id %}
              | "_" {% d => "" %}

d_direction -> n {% id %}

d_drum -> n {% id %}

d_instrument -> n {% id %}

d_listDeleteItem -> "last" {% id %}
                  | "all" {% id %}
                  | n {% id %}

d_listItem -> "last" {% id %}
            | "random" {% id %}
            | n {% id %}

d_note -> n {% id %}

m_attribute -> jpart {% id %}

block -> "move" __ n __ "steps" {% d => ["forward:", d[2]] %}
       | "turn" __ _turnRight __ n __ "degrees" {% d => ["turnRight:", d[2], d[4]] %}
       | "turn" __ _turnLeft __ n __ "degrees" {% d => ["turnLeft:", d[2], d[4]] %}
       | "point" __ "in" __ "direction" __ d_direction {% d => ["heading:", d[6]] %}
       | "point" __ "towards" __ m_spriteOrMouse {% d => ["pointTowards:", d[4]] %}
       | "go" __ "to" __ "x:" __ n __ "y:" __ n {% d => ["gotoX:y:", d[6], d[10]] %}
       | "go" __ "to" __ m_location {% d => ["gotoSpriteOrMouse:", d[4]] %}
       | "glide" __ n __ "secs" __ "to" __ "x:" __ n __ "y:" __ n {% d => ["glideSecs:toX:y:elapsed:from:", d[2], d[10], d[14]] %}
       | "change" __ "x" __ "by" __ n {% d => ["changeXposBy:", d[6]] %}
       | "set" __ "x" __ "to" __ n {% d => ["xpos:", d[6]] %}
       | "change" __ "y" __ "by" __ n {% d => ["changeYposBy:", d[6]] %}
       | "set" __ "y" __ "to" __ n {% d => ["ypos:", d[6]] %}
       | "set" __ "rotation" __ "style" __ m_rotationStyle {% d => ["setRotationStyle", d[6]] %}
       | "say" __ sb __ "for" __ n __ "secs" {% d => ["say:duration:elapsed:from:", d[2], d[6]] %}
       | "say" __ sb {% d => ["say:", d[2]] %}
       | "think" __ sb __ "for" __ n __ "secs" {% d => ["think:duration:elapsed:from:", d[2], d[6]] %}
       | "think" __ sb {% d => ["think:", d[2]] %}
       | "show" {% d => ["show"] %}
       | "hide" {% d => ["hide"] %}
       | "switch" __ "costume" __ "to" __ m_costume {% d => ["lookLike:", d[6]] %}
       | "next" __ "costume" {% d => ["nextCostume"] %}
       | "next" __ "backdrop" {% d => ["nextScene"] %}
       | "switch" __ "backdrop" __ "to" __ m_backdrop {% d => ["startScene", d[6]] %}
       | "switch" __ "backdrop" __ "to" __ m_backdrop __ "and" __ "wait" {% d => ["startSceneAndWait", d[6]] %}
       | "change" __ m_effect __ "effect" __ "by" __ n {% d => ["changeGraphicEffect:by:", d[2], d[8]] %}
       | "set" __ m_effect __ "effect" __ "to" __ n {% d => ["setGraphicEffect:to:", d[2], d[8]] %}
       | "clear" __ "graphic" __ "effects" {% d => ["filterReset"] %}
       | "change" __ "size" __ "by" __ n {% d => ["changeSizeBy:", d[6]] %}
       | "set" __ "size" __ "to" __ n __ "%" {% d => ["setSizeTo:", d[6]] %}
       | "go" __ "to" __ "front" {% d => ["comeToFront"] %}
       | "go" __ "back" __ n __ "layers" {% d => ["goBackByLayers:", d[4]] %}
       | "play" __ "sound" __ m_sound {% d => ["playSound:", d[4]] %}
       | "play" __ "sound" __ m_sound __ "until" __ "done" {% d => ["doPlaySoundAndWait", d[4]] %}
       | "stop" __ "all" __ "sounds" {% d => ["stopAllSounds"] %}
       | "play" __ "drum" __ d_drum __ "for" __ n __ "beats" {% d => ["playDrum", d[4], d[8]] %}
       | "rest" __ "for" __ n __ "beats" {% d => ["rest:elapsed:from:", d[4]] %}
       | "play" __ "note" __ d_note __ "for" __ n __ "beats" {% d => ["noteOn:duration:elapsed:from:", d[4], d[8]] %}
       | "set" __ "instrument" __ "to" __ d_instrument {% d => ["instrument:", d[6]] %}
       | "change" __ "volume" __ "by" __ n {% d => ["changeVolumeBy:", d[6]] %}
       | "set" __ "volume" __ "to" __ n __ "%" {% d => ["setVolumeTo:", d[6]] %}
       | "change" __ "tempo" __ "by" __ n {% d => ["changeTempoBy:", d[6]] %}
       | "set" __ "tempo" __ "to" __ n __ "bpm" {% d => ["setTempoTo:", d[6]] %}
       | "clear" {% d => ["clearPenTrails"] %}
       | "stamp" {% d => ["stampCostume"] %}
       | "pen" __ "down" {% d => ["putPenDown"] %}
       | "pen" __ "up" {% d => ["putPenUp"] %}
       | "set" __ "pen" __ "color" __ "to" __ c {% d => ["penColor:", d[8]] %}
       | "change" __ "pen" __ "hue" __ "by" __ n {% d => ["changePenHueBy:", d[8]] %}
       | "set" __ "pen" __ "hue" __ "to" __ n {% d => ["setPenHueTo:", d[8]] %}
       | "change" __ "pen" __ "shade" __ "by" __ n {% d => ["changePenShadeBy:", d[8]] %}
       | "set" __ "pen" __ "shade" __ "to" __ n {% d => ["setPenShadeTo:", d[8]] %}
       | "change" __ "pen" __ "size" __ "by" __ n {% d => ["changePenSizeBy:", d[8]] %}
       | "set" __ "pen" __ "size" __ "to" __ n {% d => ["penSize:", d[8]] %}
       | "when" __ _greenFlag __ "clicked" {% d => ["whenGreenFlag", d[2]] %}
       | "when" __ m_key __ "key" __ "pressed" {% d => ["whenKeyPressed", d[2]] %}
       | "when" __ "this" __ "sprite" __ "clicked" {% d => ["whenClicked"] %}
       | "when" __ "backdrop" __ "switches" __ "to" __ m_backdrop {% d => ["whenSceneStarts", d[8]] %}
       | "when" __ m_triggerSensor __ ">" __ n {% d => ["whenSensorGreaterThan", d[2], d[6]] %}
       | "when" __ "I" __ "receive" __ m_broadcast {% d => ["whenIReceive", d[6]] %}
       | "broadcast" __ m_broadcast {% d => ["broadcast:", d[2]] %}
       | "broadcast" __ m_broadcast __ "and" __ "wait" {% d => ["doBroadcastAndWait", d[2]] %}
       | "wait" __ n __ "secs" {% d => ["wait:elapsed:from:", d[2]] %}
       | "repeat" __ n {% d => ["doRepeat", d[2]] %}
       | "forever" {% d => ["doForever"] %}
       | "if" __ b __ "then" {% d => ["doIfElse", d[2]] %}
       | "wait" __ "until" __ b {% d => ["doWaitUntil", d[4]] %}
       | "repeat" __ "until" __ b {% d => ["doUntil", d[4]] %}
       | "stop" __ m_stop {% d => ["stopScripts", d[2]] %}
       | "when" __ "I" __ "start" __ "as" __ "a" __ "clone" {% d => ["whenCloned"] %}
       | "create" __ "clone" __ "of" __ m_spriteOnly {% d => ["createCloneOf", d[6]] %}
       | "delete" __ "this" __ "clone" {% d => ["deleteClone"] %}
       | "ask" __ sb __ "and" __ "wait" {% d => ["doAsk", d[2]] %}
       | "turn" __ "video" __ m_videoState {% d => ["setVideoState", d[4]] %}
       | "set" __ "video" __ "transparency" __ "to" __ n __ "%" {% d => ["setVideoTransparency", d[8]] %}
       | "reset" __ "timer" {% d => ["timerReset"] %}
       | "set" __ m_var __ "to" __ sb {% d => ["setVar:to:", d[2], d[6]] %}
       | "change" __ m_var __ "by" __ n {% d => ["changeVar:by:", d[2], d[6]] %}
       | "show" __ "variable" __ m_var {% d => ["showVariable:", d[4]] %}
       | "hide" __ "variable" __ m_var {% d => ["hideVariable:", d[4]] %}
       | "add" __ sb __ "to" __ m_list {% d => ["append:toList:", d[2], d[6]] %}
       | "delete" __ d_listDeleteItem __ "of" __ m_list {% d => ["deleteLine:ofList:", d[2], d[6]] %}
       | "if" __ "on" __ "edge," __ "bounce" {% d => ["bounceOffEdge"] %}
       | "insert" __ sb __ "at" __ d_listItem __ "of" __ m_list {% d => ["insert:at:ofList:", d[2], d[6], d[10]] %}
       | "replace" __ "item" __ d_listItem __ "of" __ m_list __ "with" __ sb {% d => ["setLine:ofList:to:", d[4], d[8], d[12]] %}
       | "show" __ "list" __ m_list {% d => ["showList:", d[4]] %}
       | "hide" __ "list" __ m_list {% d => ["hideList:", d[4]] %}

simple_reporter -> "x" __ "position" {% d => ["xpos"] %}
                 | "y" __ "position" {% d => ["ypos"] %}
                 | "direction" {% d => ["heading"] %}
                 | "costume" __ "#" {% d => ["costumeIndex"] %}
                 | "size" {% d => ["scale"] %}
                 | "backdrop" __ "name" {% d => ["sceneName"] %}
                 | "backdrop" __ "#" {% d => ["backgroundIndex"] %}
                 | "volume" {% d => ["volume"] %}
                 | "tempo" {% d => ["tempo"] %}

simple_predicate -> "touching" __ m_touching _ "?" {% d => ["touching:", d[2]] %}

simple_reporter -> "answer" {% d => ["answer"] %}

simple_predicate -> "key" __ m_key __ "pressed" _ "?" {% d => ["keyPressed:", d[2]] %}
                  | "mouse" __ "down" _ "?" {% d => ["mousePressed"] %}

simple_reporter -> "mouse" __ "x" {% d => ["mouseX"] %}
                 | "mouse" __ "y" {% d => ["mouseY"] %}
                 | "loudness" {% d => ["soundLevel"] %}
                 | "video" __ m_videoMotionType __ "on" __ m_stageOrThis {% d => ["senseVideoMotion", d[2], d[6]] %}
                 | "timer" {% d => ["timer"] %}
                 | "current" __ m_timeAndDate {% d => ["timeAndDate", d[2]] %}
                 | "days" __ "since" __ number {% d => ["timestamp", d[4]] %}
                 | "username" {% d => ["getUserName"] %}
                 | "item" __ d_listItem __ "of" __ m_list {% d => ["getLine:ofList:", d[2], d[6]] %}
                 | "length" __ "of" __ m_list {% d => ["lineCountOfList:", d[4]] %}

simple_reporter -> VariableName {% d => ['readVariable', d[0]] %}

block -> "else" {% d => ["else"] %}
       | "end" {% d => ["end"] %}
       | "..." {% d => ["ellips"] %}


_ -> [ ]:* {% d => null %}
__ -> [ ]:+ {% d => null %}

string -> "'hello'"             {% d => 'hello' %}
number -> digits                {% d => parseInt(d[0]) %}
number -> digits [.] digits     {% d => parseFloat(d.join('')) %}

digits -> [0-9]:+   {% d => d[0].join('') %}

color -> [#] [0-9a-z] [0-9a-z] [0-9a-z] [0-9a-z] [0-9a-z] [0-9a-z]
       | [#] [0-9a-z] [0-9a-z] [0-9a-z]

VariableName -> "foo" {% id %}
ListName -> "list" {% id %}

