<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="max-w-7xl h-960px mx-auto px-12 py-4">
        <example-component></example-component>
    </div>
</x-app-layout>
