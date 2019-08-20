const exposingList = "(application, PageRoute, all, pages, routeToString)";

function staticRouteStuff(staticRoutes) {
  return `

type PageRoute = PageRoute (List String)

${staticRoutes.allRoutes}

${staticRoutes.routeRecord}

${staticRoutes.urlParser}

${staticRoutes.assetsRecord}

routeToString : PageRoute -> String
routeToString (PageRoute route) =
    "/"
      ++ (route |> String.join "/")
`;
}

function elmPagesUiFile(staticRoutes) {
  return `port module PagesNew exposing ${exposingList}

import Dict exposing (Dict)
import Head
import Html exposing (Html)
import Json.Decode
import Json.Encode
import Mark
import Pages
import Pages.ContentCache exposing (Page)
import Pages.Manifest
import RawContent
import Url.Parser as Url exposing ((</>), s)


port toJsPort : Json.Encode.Value -> Cmd msg


application :
    { init : ( userModel, Cmd userMsg )
    , update : userMsg -> userModel -> ( userModel, Cmd userMsg )
    , subscriptions : userModel -> Sub userMsg
    , view : userModel -> List ( List String, metadata ) -> Page metadata view -> { title : String, body : Html userMsg }
    , parser : Pages.Parser metadata view
    , head : metadata -> List Head.Tag
    , frontmatterParser : Json.Decode.Decoder metadata
    , markdownToHtml : String -> view
    , manifest : Pages.Manifest.Config
    }
    -> Pages.Program userModel userMsg metadata view
application config =
    Pages.application
        { init = config.init
        , view = config.view
        , update = config.update
        , subscriptions = config.subscriptions
        , parser = config.parser
        , frontmatterParser = config.frontmatterParser
        , content = RawContent.content
        , markdownToHtml = config.markdownToHtml
        , toJsPort = toJsPort
        , head = config.head
        , manifest = config.manifest
        }
${staticRouteStuff(staticRoutes)}
`;
}

function elmPagesCliFile(staticRoutes) {
  return `port module PagesNew exposing ${exposingList}

import Dict exposing (Dict)
import Head
import Html exposing (Html)
import Json.Decode
import Json.Encode
import Mark
import Pages
import Pages.ContentCache exposing (Page)
import Pages.Manifest
import RawContent
import Url.Parser as Url exposing ((</>), s)


port toJsPort : Json.Encode.Value -> Cmd msg


application :
    { init : ( userModel, Cmd userMsg )
    , update : userMsg -> userModel -> ( userModel, Cmd userMsg )
    , subscriptions : userModel -> Sub userMsg
    , view : userModel -> List ( List String, metadata ) -> Page metadata view -> { title : String, body : Html userMsg }
    , parser : Pages.Parser metadata view
    , head : metadata -> List Head.Tag
    , frontmatterParser : Json.Decode.Decoder metadata
    , markdownToHtml : String -> view
    , manifest : Pages.Manifest.Config
    }
    -> Pages.Program userModel userMsg metadata view
application config =
    Pages.cliApplication
        { init = config.init
        , view = config.view
        , update = config.update
        , subscriptions = config.subscriptions
        , parser = config.parser
        , frontmatterParser = config.frontmatterParser
        , content = RawContent.content
        , markdownToHtml = config.markdownToHtml
        , toJsPort = toJsPort
        , head = config.head
        , manifest = config.manifest
        }


${staticRouteStuff(staticRoutes)}
`;
}
module.exports = { elmPagesUiFile, elmPagesCliFile };