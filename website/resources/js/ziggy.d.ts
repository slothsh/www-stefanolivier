/* This file is generated by Ziggy. */
declare module 'ziggy-js' {
  interface RouteList {
    "debugbar.openhandler": [],
    "debugbar.clockwork": [
        {
            "name": "id",
            "required": true
        }
    ],
    "debugbar.assets.css": [],
    "debugbar.assets.js": [],
    "debugbar.cache.delete": [
        {
            "name": "key",
            "required": true
        },
        {
            "name": "tags",
            "required": false
        }
    ],
    "debugbar.queries.explain": [],
    "home.index": [],
    "blog.index": [],
    "blog.show": [
        {
            "name": "slug",
            "required": true
        }
    ],
    "storage.local": [
        {
            "name": "path",
            "required": true
        }
    ]
}
}
export {};
