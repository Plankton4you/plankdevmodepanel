import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define interface for translations
interface Translations {
  general: {
    title: string;
    description: string;
    darkTheme: string;
    darkThemeDesc: string;
    notifications: string;
    notificationsDesc: string;
    showOfflineDevices: string;
    showOfflineDevicesDesc: string;
    autoRefresh: string;
    autoRefreshDesc: string;
    language: string;
    languageDesc: string;
  };
  buttons: {
    save: string;
    saving: string;
    reset: string;
  };
  languages: {
    [key: string]: string;
  };
  // More sections can be added as needed
}

// English translations
const enTranslations: Translations = {
  general: {
    title: "General Settings",
    description: "Manage general application settings",
    darkTheme: "Dark Theme",
    darkThemeDesc: "Enable or disable dark theme for the application",
    notifications: "Notifications",
    notificationsDesc: "Enable or disable browser notifications for device events",
    showOfflineDevices: "Show Offline Devices",
    showOfflineDevicesDesc: "Show or hide offline devices in the dashboard",
    autoRefresh: "Auto-Refresh Interval",
    autoRefreshDesc: "Set how often the dashboard automatically refreshes data (in seconds)",
    language: "Display Language",
    languageDesc: "Select the display language for the application",
  },
  buttons: {
    save: "Save Changes",
    saving: "Saving...",
    reset: "Reset to Defaults",
  },
  languages: {
    en: "English",
    id: "Bahasa Indonesia",
    es: "Spanish",
    fr: "French",
    de: "German",
    ja: "Japanese",
  }
};

// Indonesian translations
const idTranslations: Translations = {
  general: {
    title: "Pengaturan Umum",
    description: "Kelola pengaturan aplikasi umum",
    darkTheme: "Tema Gelap",
    darkThemeDesc: "Aktifkan atau nonaktifkan tema gelap untuk aplikasi",
    notifications: "Notifikasi",
    notificationsDesc: "Aktifkan atau nonaktifkan notifikasi browser untuk acara perangkat",
    showOfflineDevices: "Tampilkan Perangkat Offline",
    showOfflineDevicesDesc: "Tampilkan atau sembunyikan perangkat offline di dashboard",
    autoRefresh: "Interval Auto-Refresh",
    autoRefreshDesc: "Atur seberapa sering dashboard memperbarui data secara otomatis (dalam detik)",
    language: "Bahasa Tampilan",
    languageDesc: "Pilih bahasa tampilan untuk aplikasi",
  },
  buttons: {
    save: "Simpan Perubahan",
    saving: "Menyimpan...",
    reset: "Kembalikan ke Default",
  },
  languages: {
    en: "English",
    id: "Bahasa Indonesia",
    es: "Spanish",
    fr: "French",
    de: "German",
    ja: "Japanese",
  }
};

export default function Settings() {
  const { toast } = useToast();
  const [botToken, setBotToken] = useState(""); // Should use environment variable
  const [telegramId, setTelegramId] = useState("7989345122"); // Use environment variable in production
  const [serverAddress, setServerAddress] = useState("https://www.google.com"); // Use environment variable in production
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(30);
  const [darkTheme, setDarkTheme] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [showOfflineDevices, setShowOfflineDevices] = useState(true);
  const [saveCommandHistory, setSaveCommandHistory] = useState(true);
  const [autoConnect, setAutoConnect] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Add language state
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState<Translations>(enTranslations);
  
  // Update translations when language changes
  useEffect(() => {
    switch(language) {
      case "id":
        setTranslations(idTranslations);
        break;
      default:
        setTranslations(enTranslations);
    }
  }, [language]);
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully",
      });
    }, 1000);
  };
  
  const handleResetDefaults = () => {
    // Reset to default values
    setBotToken("");
    setTelegramId("7989345122");
    setServerAddress("https://www.google.com");
    setAutoRefreshInterval(30);
    setDarkTheme(true);
    setEnableNotifications(true);
    setShowOfflineDevices(true);
    setSaveCommandHistory(true);
    setAutoConnect(true);
    
    toast({
      title: "Defaults restored",
      description: "All settings have been reset to default values",
    });
  };
  
  const handleTestConnection = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Connection successful",
        description: "The server connection test completed successfully",
      });
    }, 2000);
  };
  
  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{translations.general.title}</CardTitle>
              <CardDescription>
                {translations.general.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkTheme" className="text-base">{translations.general.darkTheme}</Label>
                  <Switch
                    id="darkTheme"
                    checked={darkTheme}
                    onCheckedChange={setDarkTheme}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {translations.general.darkThemeDesc}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="text-base">{translations.general.notifications}</Label>
                  <Switch
                    id="notifications"
                    checked={enableNotifications}
                    onCheckedChange={setEnableNotifications}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {translations.general.notificationsDesc}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showOfflineDevices" className="text-base">{translations.general.showOfflineDevices}</Label>
                  <Switch
                    id="showOfflineDevices"
                    checked={showOfflineDevices}
                    onCheckedChange={setShowOfflineDevices}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {translations.general.showOfflineDevicesDesc}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label className="text-base">{translations.general.autoRefresh}</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[autoRefreshInterval]}
                    onValueChange={(values) => setAutoRefreshInterval(values[0])}
                    min={5}
                    max={60}
                    step={5}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{autoRefreshInterval}s</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {translations.general.autoRefreshDesc}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label className="text-base">{translations.general.language}</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{translations.languages.en}</SelectItem>
                    <SelectItem value="id">{translations.languages.id}</SelectItem>
                    <SelectItem value="es">{translations.languages.es}</SelectItem>
                    <SelectItem value="fr">{translations.languages.fr}</SelectItem>
                    <SelectItem value="de">{translations.languages.de}</SelectItem>
                    <SelectItem value="ja">{translations.languages.ja}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {translations.general.languageDesc}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleResetDefaults}>
                {translations.buttons.reset}
              </Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? translations.buttons.saving : translations.buttons.save}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Connection Settings</CardTitle>
              <CardDescription>
                Configure your server and Telegram bot connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="serverAddress">Server Address</Label>
                <Input
                  id="serverAddress"
                  value={serverAddress}
                  onChange={(e) => setServerAddress(e.target.value)}
                  placeholder="https://example.com"
                />
                <p className="text-sm text-muted-foreground">
                  The address of your server for device connections
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="botToken">Telegram Bot Token</Label>
                <Input
                  id="botToken"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  type="password"
                  placeholder="Enter your Telegram bot token"
                />
                <p className="text-sm text-muted-foreground">
                  Your Telegram bot token for notifications and commands
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telegramId">Telegram Chat ID</Label>
                <Input
                  id="telegramId"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  placeholder="Enter your Telegram chat ID"
                />
                <p className="text-sm text-muted-foreground">
                  Your Telegram chat ID to receive notifications
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoConnect" className="text-base">Auto-Connect to Devices</Label>
                  <Switch
                    id="autoConnect"
                    checked={autoConnect}
                    onCheckedChange={setAutoConnect}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically connect to devices when they come online
                </p>
              </div>
              
              <Button variant="outline" className="w-full" onClick={handleTestConnection} disabled={isLoading}>
                {isLoading ? "Testing..." : "Test Connection"}
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleResetDefaults}>
                Reset to Defaults
              </Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="saveHistory" className="text-base">Save Command History</Label>
                  <Switch
                    id="saveHistory"
                    checked={saveCommandHistory}
                    onCheckedChange={setSaveCommandHistory}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Save command history for all devices
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label className="text-base">Log Level</Label>
                <Select defaultValue="info">
                  <SelectTrigger>
                    <SelectValue placeholder="Select log level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Set the application logging level
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label className="text-base">Data Retention</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue placeholder="Select data retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="0">Indefinite</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  How long to retain activity logs and other data
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Button variant="destructive" className="w-full">
                  Clear All Data
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  This will delete all stored data including device information, logs, and settings.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Application Version</Label>
                <div className="p-2 bg-muted rounded-md">
                  <code className="text-sm">Panel Plank.Dev V4.1.1</code>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleResetDefaults}>
                Reset to Defaults
              </Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
