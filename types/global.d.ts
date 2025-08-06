// types/global.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_TELEGRAM_BOT_TOKEN: string;
    NEXT_PUBLIC_TELEGRAM_CHAT_ID: string;
  }
}

// Extend window to include Freighter
interface Window {
  freighterApi?: {
    isInstalled?: () => Promise<boolean>;
    getUserInfo: () => Promise<{
      publicKey: string;
      nickname?: string;
    }>;
    signTransaction: (txXdr: string, pubKey?: string) => Promise<{ signedTransactionXdr: string }>;
  };
}