
import React, { useState } from 'react';
import { ShieldCheck, X, CreditCard, Truck, Zap, Info, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Artwork, UserProfile } from '../types';
import { Box, Flex, Text, Button, Separator, Spacer } from '../flow';
import toast from 'react-hot-toast';

interface CheckoutModalProps {
  artwork: Artwork;
  user: UserProfile;
  onClose: () => void;
  onSuccess: (ref: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ artwork, user, onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const shippingCost = 150; // Mocked logistics
  const total = artwork.price + shippingCost;

  const handlePaystackPayment = () => {
    setIsProcessing(true);
    
    // Paystack SDK handshake
    const handler = (window as any).PaystackPop.setup({
      key: 'pk_test_placeholder_key', // In production, use process.env.PAYSTACK_PUBLIC_KEY
      email: user.email,
      amount: total * 100, // Amount in kobo/cents
      currency: artwork.currency || 'USD',
      metadata: {
        artwork_id: artwork.id,
        artwork_title: artwork.title,
        custom_fields: [
          {
            display_name: "Asset Title",
            variable_name: "asset_title",
            value: artwork.title
          }
        ]
      },
      callback: (response: any) => {
        setIsProcessing(false);
        toast.success('Acquisition Signal Confirmed.');
        onSuccess(response.reference);
      },
      onClose: () => {
        setIsProcessing(false);
        toast.error('Acquisition Interrupted.');
      }
    });

    handler.openIframe();
  };

  return (
    <Box position="fixed" zIndex={300} inset={0} bg="rgba(255,255,255,0.9)" className="backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <Box maxWidth="1000px" width="100%" bg="white" shadow="0 30px 60px rgba(0,0,0,0.12)" border="1px solid #E5E5E5" borderRadius="32px" overflow="hidden" className="animate-in zoom-in-95 duration-500">
        <Flex direction={['column', 'row']} height="100%">
          
          {/* Summary Column */}
          <Box width={['100%', '45%']} bg="#F8F8F8" p={4} borderRight="1px solid #E5E5E5">
            <Flex justify="between" align="center" mb={4}>
               <Text variant="label" color="#999">Acquisition Summary</Text>
               <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all group">
                  <X size={20} className="text-gray-300 group-hover:text-black" />
               </button>
            </Flex>

            <Box position="relative" borderRadius="16px" overflow="hidden" mb={3} shadow="0 10px 30px rgba(0,0,0,0.1)">
               <img src={artwork.imageUrl} className="w-full aspect-[4/5] object-cover" alt={artwork.title} />
               <Box position="absolute" bottom={0} left={0} right={0} p={3} bg="linear-gradient(to top, rgba(0,0,0,0.8), transparent)">
                  <Text weight="bold" color="white" size={20}>{artwork.title}</Text>
                  <Text color="rgba(255,255,255,0.6)" size={14} className="block italic">{artwork.artist}, {artwork.year}</Text>
               </Box>
            </Box>

            <Box space-y={2}>
               <Flex justify="between">
                  <Text size={14} color="#666">Valuation</Text>
                  <Text size={14} weight="bold">${artwork.price.toLocaleString()}</Text>
               </Flex>
               <Flex justify="between">
                  <Text size={14} color="#666">White-Glove Logistics</Text>
                  <Text size={14} weight="bold">${shippingCost}</Text>
               </Flex>
               <Separator m={2} />
               <Flex justify="between">
                  <Text size={18} weight="bold">Total Acquisition</Text>
                  <Text size={24} weight="black" color="#1023D7">${total.toLocaleString()}</Text>
               </Flex>
            </Box>
          </Box>

          {/* Payment Column */}
          <Box flex={1} p={6} className="space-y-8">
             <Box>
                <Flex align="center" gap={1} mb={1}>
                   <ShieldCheck size={18} className="text-blue-100" />
                   <Text variant="h2" weight="bold">Secured Handshake.</Text>
                </Flex>
                <Text color="#666" weight="light" size={16}>You are about to initiate a legal acquisition protocol. Funds will be held in escrow via Paystack.</Text>
             </Box>

             <Box className="space-y-4">
                <Box p={3} border="1px solid #E5E5E5" borderRadius="16px" className="bg-gray-50 flex items-center gap-4">
                   <Box p={2} bg="white" borderRadius="8px" shadow="sm"><CreditCard size={20} /></Box>
                   <Box>
                      <Text size={14} weight="bold" className="block">Paystack Checkout</Text>
                      <Text size={12} color="#999">Secure Cards, Bank Transfer, & Apple Pay</Text>
                   </Box>
                </Box>

                <Box p={3} border="1px solid #E5E5E5" borderRadius="16px" className="bg-gray-50 flex items-center gap-4 opacity-50 cursor-not-allowed">
                   <Box p={2} bg="white" borderRadius="8px" shadow="sm"><Zap size={20} /></Box>
                   <Box>
                      <Text size={14} weight="bold" className="block">Crypto Settlement</Text>
                      <Text size={12} color="#999">ETH / USDC (Coming Soon)</Text>
                   </Box>
                </Box>
             </Box>

             <Box bg="#F0F7FF" p={3} borderRadius="16px" border="1px solid #C2E0FF" className="flex items-start gap-3">
                <Info size={16} className="text-blue-100 mt-1 shrink-0" />
                <Text size={12} color="#1023D7" lineHeight={1.5}>
                  ArtFlow guarantees the provenance of this asset. Your Digital Certificate of Authenticity (CoA) will be synthesized immediately following payment confirmation.
                </Text>
             </Box>

             <Spacer y={2} />

             <Button 
               variant="primary" 
               size="lg" 
               className="w-full h-16 text-lg" 
               onClick={handlePaystackPayment}
               loading={isProcessing}
             >
                <Lock size={18} className="mr-2" /> Execute Acquisition
             </Button>

             <Flex align="center" justify="center" gap={1}>
                <Lock size={12} color="#CCC" />
                <Text size={10} color="#CCC" weight="bold" tracking="0.1em" className="uppercase">End-to-End Encrypted Signal</Text>
             </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
