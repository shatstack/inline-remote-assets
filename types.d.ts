declare function matchRemoteHref(tag: string): string | null;

/**
 * Inline & purge CSS rules from CDN/remote includes into HTML
 * @param html - HTML document string into which to inline remote asset
 * @param _ - inline-remote-asset options
 */
declare function inlineCss(html: string, _: any): Promise<string>;

declare function matchRemoteSrc(tag: string): string | null;

/**
 * Inline JavaScript loaded from CDN/remote into HTML script directly
 * @param html - HTML document string
 * @param options - inline-remote-assets options
 * @param options.max - Maximum size of asset to be inlined (in bytes)
 */
declare function inlineJs(html: string, options: {
    max: number;
}): Promise<string>;

declare const cache: {
    set: (...params: any[]) => any;
    get: (...params: any[]) => any;
};

/**
 * Load & cache (to fs) remote stylesheets
 * @param url - Stylesheet URL to load
 * @param options.noCache - Whether to use existing cache
 * @param options.cachePath - Where to store the cache
 */
declare function loadRemoteAsset(url: string, options: {
    noCache: boolean;
    cachePath: string;
}): Promise<{ size: number; value: string; }>;

/**
 * Inline Remote Assets
 */
declare module "inline-remote-assets/main" {
    /**
     * @param options.max - Maximum size of asset to be inlined (in bytes)
     */
    function main(globPattern: string, options: {
        output?: string;
        max: number;
    }): Promise<void>;
}

declare function matchRemoteResource(tag: string, resourceLocationRegex: RegExp): string | null;

