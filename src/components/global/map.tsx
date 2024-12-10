// @ts-nocheck
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Leaf } from 'lucide-react'
import ContractInteraction from './ContractInteraction'
import { encryptWasteData, submitEncryptedWasteData, performDataAnalysis } from '@/utils/litProtocol'
import { useSessionSigs } from '@/hooks/useSessionSigs'