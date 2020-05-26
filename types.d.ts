declare function matchRemoteHref(tag: string): string | null;

/**
 * Inline & purge CSS rules from CDN/remote includes into HTML
 * @param html - HTML document string into which to inline remote asset
 * @param _.maxSize - Maximum size of asset to be inlined (in bytes)
 */
declare function inlineCss(html: string, _?: {
    maxSize: number;
    output?: string;
}): Promise<string>;

declare function matchRemoteSrc(tag: string): string | null;

/**
 * Inline JavaScript loaded from CDN/remote into HTML script directly
 * @param html - HTML document string
 * @param options.maxSize - Maximum size of asset to be inlined (in bytes)
 */
declare function inlineJs(html: string, options: {
    maxSize: number;
    output?: string;
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
     * @param options.maxSize - Maximum size of asset to be inlined (in bytes)
     */
    function main(globPattern: string, options: {
        maxSize: number;
        output?: string;
    }): Promise<void>;
}

declare function matchRemoteResource(tag: string, resourceLocationRegex: RegExp): string | null;

