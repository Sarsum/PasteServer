module.exports = {
    server: {
        port: process.env.PORT
    },
    autoUpdate: {
        enabled: false,
        packageJsonURL: "https://raw.githubusercontent.com/realPanamo/PasteServer/master/package.json",
        zipURL: "https://github.com/realPanamo/PasteServer/archive/master.zip",
        keepFiles: [],
        devPackageJsonURL: "https://raw.githubusercontent.com/realPanamo/PasteServer/development/package.json",
        devZipUrl: "https://github.com/realPanamo/PasteServer/archive/development.zip"
    },
    storage: {
        type: process.env.STORAGE_TYPE,
        host: process.env.STORAGE_HOST,
        port: process.env.STORAGE_PORT,
        password: process.env.STORAGE_PASSWORD,
        // only arangodb
        user: process.env.STORAGE_USER,
        database: process.env.STORAGE_DATABASE,
        // only redis
        documentExpireInMs: process.env.DOCUMENT_EXPIRE,
        // only file
        path: process.env.STORAGE_PATH
    },
    createRateLimit: {
        timeInMs: process.env.CREATE_RATE_LIMIT_TIME_IN_MS,
        maxRequestsPerTime: process.env.CREATE_RATE_LIMIT_MAX_REQUESTS_PER_TIME
    },
    document: {
        dataLimit: process.env.DOCUMENT_DATA_LIMIT,
        maxLength: process.env.DOCUMENT_MAX_LENGTH
    },
    keyGenerator: {
        keyLength: process.env.KEY_GENERATOR_KEY_LENGTH,
        keyChars: process.env.KEY_GENERATOR_KEY_CHARS,
        withToUpperCase: process.env.KEY_GENERATOR_WITH_TO_UPPER_CASE
    },
};
