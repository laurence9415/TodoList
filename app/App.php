<?php

namespace App;

class App
{
    public static function json()
    {
        return auth()->user();
    }
}
