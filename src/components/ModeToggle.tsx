"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Button variant="outline" size="icon" className="w-9 px-0" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {
                theme === "dark"
                    ? <SunIcon className="h-5 w-5" />
                    : <MoonIcon className="h-5 w-5" />
            }
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
