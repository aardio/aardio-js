/// <reference types="electron" />

export = aardio;
export as namespace aardio;
declare const aardio: aardio.ExternalEx

declare namespace aardio {

    type ExternalEx = External & {
        [key: string]: (...args: any[]) => Promise<any>;
    }

    interface External {

        /** 连接 RPC 服务端, 如果已连接则重用当前连接 */
        open(rpcPort?:number) : Promise<void>;

        /** 当前是否已连接 RPC 服务端 */
        isConnected() : boolean
		
        /** aardio 模块以及 RPC 函数服务端是否已准备就绪（如果当前是浏览器渲染进程则 DOM 已准备就绪），在此之前RPC函数只能通过 xcall 调用 */
        isReady: boolean; 

        /** 
         * 在 aardio 模块以及RPC函数服务端已准备就绪后（如果当前是浏览器渲染进程则DOM已准备就绪），
         * 执行此回调(如果当前已经准备就绪就直接执行),这里注册的函数保证只会执行一次，重新连接后必须重新调用此函数注册。 
         */
        ready(listener: (win?: Electron.BrowserWindow) => void): ExternalEx; 

        /** 
         * 调用 aardio 函数。
         * 如果网页由 aardio 启动，例如 chrome.app, electron.app 创建的进程，
         * 或者 nodeJs 支持库创建的 node 进程访问 web.rpc.externalServer 创建的 RPC服务器，
         * 都是在导入 aardio.js 同时创建远程函数（即自动注入 AADSL 函数声明）。
         * 如果在 aardio 环境以外启动的外部浏览器，不能自动注入 AADSL 函数声明，
         * 并且在 aardio.open() 手动连接成功以前，就只能使用 xcall 调用尚未创建的远程函数。
		*/
        xcall(method: string, ...args: any[]): Promise<any>;

        /** 注册 aardio 可调用的 JS 回调函数，如果同一进程内注册多个同名回调，仅回传最后一次回调的返回值 */
        on(event: string, listener: (...args: any[]) => void): ExternalEx;

        /** RPC 服务端断开连接或连接失败 */
        on(event: "close", onClose: () => void): ExternalEx; 

        /** 注销 aardio 可调用的 JS 回调函数，如果省略 @listener 参数则注销所有使用该事件注册的 JS 回调函数 */
        off(event: string, listener?: (...args: any[]) => void): ExternalEx;
		
        /** 引用内置模块 */
        require<T = any>(moduleName: string): T;

        /** 引用内置 Electron 模块 */
        require(moduleName: 'electron'): typeof Electron;

        /** 退出进程,需要当前 RPC 服务端支持此函数才能调用成功  */
        quit: () => void;

        /** 拖动标题栏,需要当前 RPC 服务端支持此函数才能调用成功  */
        hitCaption: () => Promise<void>;

        /** 点击关闭窗口按钮,需要当前 RPC 服务端支持此函数才能调用成功  */
        hitClose: () => Promise<void>;

        /** 点击最小化按钮,需要当前 RPC 服务端支持此函数才能调用成功  */
        hitMin: () => Promise<void>;

        /** 点击最大化按钮,需要当前 RPC 服务端支持此函数才能调用成功  */
        hitMax: () => Promise<boolean>;

        /** 窗口是否最大化,需要当前 RPC 服务端支持此函数才能调用成功  */
        isZoomed: () => Promise<boolean>;

        /** 读取本地数据,此函数默认未定义，请在aardio的external接口导出该函数 */
        get: <T = any>(key: string) => Promise<T>;

        /** 写入本地数据,此函数默认未定义，请在aardio的external接口导出该函数 */
        set: <T>(key: string, value?: T) => Promise<void>;
    }
	
    interface External {

        /** 当前是否在浏览器环境中运行，在 Electron 主进程运行为 false */
        browser: boolean;

        /** 当前是否在 Electron 环境中运行 */
        electron: boolean;

        /** 当前是否在 Electron 渲染进程中运行 */
        electronRenderer: boolean;

        /** 当前是否在 aardio 开发环境中运行，发布后为 false */
        studioInvoke: boolean;

        /** 当前 Electron 窗口句柄 */
        hwndElectron: number; 
        
        /** 
         * 在 aardio 中创建 electron.app 对象时传入的启动参数，
         * 这是一个 Electron 多进程共享对象，读写已经存在的字段时会自动更新为最新的值。
         * 如果增加了字段请自行添加d.ts文件，并在 aardio 名字空间下添加 StartEnviron 接口的成员,
         * 使用 web.rpc.externalServer 创建 RPC 服务端以后，nodeJs 支持库创建的进程也可以访问此对象
         */
        startEnviron: StartEnviron;
    }

    interface External {
	
        /** 获取 electron 主进程全局变量，仅在 Electron 环境中有效 */
        getGlobal<T = any>(sharedObjectName: string): T

         /** 返回主窗口，仅在 electron 环境中有效  */
        getMainWindow(): Electron.BrowserWindow;

        /** Electron 渲染进程返回当前 BrowserWindow 对象,主进程中返回主窗口 */
        getCurrentWindow(): Electron.BrowserWindow;

        /** 
         * 创建 Electron 窗口，
         * options 未指定的选项将使用创建主窗口时指定的值,
         * 此函数仅在 Electron 环境中有效 
         * */
        createBrowserWindow(options?: Electron.BrowserWindowConstructorOptions): Electron.BrowserWindow 

        /** 
         * 创建 Electron 窗口并打开指定网址，
         * options 未指定的选项将使用创建主窗口时指定的值,
         * loadUrl 可使用相对于主窗口页面的相对路径，如果loadUrl首字符为斜杠则转换为根对于根目录的路径
         * 此函数仅在 Electron 环境中有效 
         * */
        createBrowserWindow(options: Electron.BrowserWindowConstructorOptions,loadUrl: string, loadUrlOptions?: Electron.LoadURLOptions): Electron.BrowserWindow;

        /**  
         * Electron 内 @url 可传入以主窗口首页地址的相对路径，
         * 其他网页 @url 可传入以当前网页地址的相对路径，
         * 如果传入 @url 首字符为斜杆，则为应用根目录的相对路径，
         * 返回完整URL
         * */
        fullUrl(url:string):string;
    }

    interface StartEnviron {
        /** 
         * 主窗口启动的主页地址,
         * 如果主页置入主进程目录则默认使用 file: 协议， 
         * 置入 aardio 资源目录则默认使用 http: 协议
         * */
        indexUrl: string;

        /** 启动参数 */
        args ?: { [key: string]: string;  }

        /** 主进程启动目录,electron.app 创建的应用发布后为 asar 文件路径 */
        appPath: string;

        /** RPC 服务以及嵌入 HTTP 服务端口 */
        rpcPort: number;

        /** electron.app 创建主窗口使用的参数 */
        browserWindow: Electron.BrowserWindowConstructorOptions;

        /** 应用程序英文名称 */
        name: string;

        /** 窗口默认标题,可在 aardio 中创建 electron.app 的第一个参数中指定，或使用win.title指定 */
        title: string;

        /** Electron 主窗口使用的图标路径 */
        icon: string;
        
        /** 自定义启动令牌 */
        token?: string;
    }
}