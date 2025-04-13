
import { useState } from "react";
import { Check, X } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const walletFormSchema = z.object({
  walletType: z.string({
    required_error: "Please select a wallet type.",
  }),
  walletId: z
    .string()
    .min(10, { message: "Wallet ID must be at least 10 characters." })
    .max(64, { message: "Wallet ID cannot exceed 64 characters." })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Wallet ID can only contain alphanumeric characters.",
    }),
});

type WalletFormValues = z.infer<typeof walletFormSchema>;

interface WalletConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnectSuccess: () => void;
}

export function WalletConnectDialog({
  open,
  onOpenChange,
  onConnectSuccess,
}: WalletConnectDialogProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<WalletFormValues>({
    resolver: zodResolver(walletFormSchema),
    defaultValues: {
      walletType: "",
      walletId: "",
    },
  });

  function onSubmit(data: WalletFormValues) {
    setIsConnecting(true);
    
    // Simulate wallet connection 
    setTimeout(() => {
      setIsConnecting(false);
      onOpenChange(false);
      onConnectSuccess();
      
      toast({
        title: "Wallet connected successfully",
        description: `Connected to ${data.walletType} wallet`,
      });
    }, 1500);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Select your wallet type and enter your wallet ID to connect.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="walletType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a wallet type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="aptos">Aptos Wallet</SelectItem>
                      <SelectItem value="petra">Petra Wallet</SelectItem>
                      <SelectItem value="martian">Martian Wallet</SelectItem>
                      <SelectItem value="pontem">Pontem Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="walletId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your wallet ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isConnecting}
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isConnecting}>
                {isConnecting ? (
                  <>Connecting...</>
                ) : (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    Connect
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
