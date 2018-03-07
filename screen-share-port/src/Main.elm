port module Main exposing (..)

import Css exposing (..)
import Html as Html
import Html.Styled exposing (text, div, h1, img, button, input, video)
import Html.Styled.Events exposing (onClick, onInput)
import Html.Styled.Attributes exposing (src, placeholder, id, autoplay)
import Html.Styled.Attributes exposing (css)


---- MODEL ----

type alias Model =
    { toJs : String
    , fromJs : String }


init : ( Model, Cmd Msg )
init =
    ( { toJs = "", fromJs = "" }, Cmd.none )



---- UPDATE ----

type Msg
    = ShareScreen
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ShareScreen ->
            model ! [ shareScreen () ]
        _ ->
            ( model, Cmd.none )

---- Subscriptions ----

port toJs : String -> Cmd msg
port toElm : (String -> msg) -> Sub msg

port shareScreen : () -> Cmd msg

---- VIEW ----

view : Model -> Html.Styled.Html Msg
view model =
    div []
        [ h1 [] [ text "Request screen sharing with JS" ]
        , video [ id "screen-container"
                , autoplay True
                , css
                    [ width (px 800)
                    , height (px 680)
                    ] 
                ] []
        , button [ onClick ShareScreen ] [ text "Share Screen" ]
        ]


---- PROGRAM ----

main : Program Never Model Msg
main =
    Html.program
        { view = view >> Html.Styled.toUnstyled
        , init = init
        , update = update
        , subscriptions = \model -> Sub.none
        }

