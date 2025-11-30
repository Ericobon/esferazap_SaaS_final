import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function ContactList({ contacts, activeContactId, onSelectContact }) {
    return (
        <div className="flex flex-col h-full border-r border-border bg-card/30 backdrop-blur-sm">
            {/* Search Header */}
            <div className="p-4 border-b border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search chats..."
                        className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {contacts.map((contact) => (
                    <button
                        key={contact.id}
                        onClick={() => onSelectContact(contact)}
                        className={cn(
                            "w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left border-b border-border/30",
                            activeContactId === contact.id && "bg-primary/10 hover:bg-primary/15 border-l-4 border-l-primary"
                        )}
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold text-secondary-foreground">
                                {contact.name.charAt(0)}
                            </div>
                            {contact.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium truncate">{contact.name}</span>
                                <span className="text-xs text-muted-foreground">{contact.lastTime}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground truncate pr-2">
                                    {contact.lastMessage}
                                </p>
                                {contact.unread > 0 && (
                                    <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground text-[10px]">
                                        {contact.unread}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
