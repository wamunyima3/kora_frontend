"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useServices } from "@/hooks/Services";

const colors = ["#FEF3E2", "#FDE8C8", "#FCDCAE"];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: services = [], isLoading } = useServices();

  const filteredServices = services.filter(
    (service) =>
      service.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pl-2 pr-4 pb-6">
        <div className="max-w-7xl mx-auto">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pl-2 pr-4 pb-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">All Services</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Browse and manage all available services
            </p>
          </div>
          <Link href="/services/configure">
            <Button style={{ backgroundColor: "#B4813F" }} className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Service
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full bg-white dark:bg-card"
          />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredServices.map((service, idx) => (
            <Link key={service.id} href={`/services/details/${service.id}`}>
              <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                <CardHeader>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  >
                    <FileText
                      className="h-6 w-6"
                      style={{ color: "#B4813F" }}
                    />
                  </div>
                  <CardTitle className="text-lg">{service.service_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {service?.description || 'No description available'}
                  </p> */}
                  <div className="flex items-center justify-end">
                    <ArrowRight
                      className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "#B4813F" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No services found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
