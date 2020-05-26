declare const cache: {
    set: (...params: any[]) => any;
    get: (...params: any[]) => any;
};

declare function matchRemoteHref(tag: string): string | null;

declare function purgeStyles(html: string, styleSheetContents: { url: string; asset: { value: string; size: number; }; }[]): Promise<{ url: string; asset: { value: string; size: number; }; }[]>;

/**
 * Inline & purge CSS rules from CDN/remote includes into HTML
 * @param html - HTML document string into which to inline remote asset
 */
declare function inlineCss(html: string, options: {
    maxSize?: number;
    cssMaxSize?: number;
}): Promise<string>;

declare function matchRemoteSrc(tag: string): string | null;

/**
 * Inline JavaScript loaded from CDN/remote into HTML script directly
 * @param html - HTML document string
 * @param options.maxSize - Maximum size of asset to be inlined (in bytes)
 */
declare function inlineJs(html: string, options: {
    maxSize: number;
}): Promise<string>;

/**
 * Load & cache (to fs) remote stylesheets
 * @param url - Stylesheet URL to load
 */
declare function loadRemoteAsset(url: string): Promise<{ size: number; value: string; }>;

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
        cssMaxSize?: number;
    }): Promise<void>;
}

declare function matchRemoteResource(tag: string, resourceLocationRegex: RegExp): string | null;

/**
 * @param string - string to digest
 */
declare function digest(string: string): string;

/**
 * @param p - Path to check
 */
declare function isPathWriteable(p: string): void;

declare function ensureWriteablePath(filePath: string): Promise<void>;

declare function urlsToAssets(urlsWithAssets: { url: string; asset: object; }[]): Record<string, object>;

