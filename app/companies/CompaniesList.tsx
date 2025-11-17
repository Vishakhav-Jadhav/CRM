// "use client";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import type { Company } from "@/types";

// export default function CompaniesList({
//   companies,
//   onSelect,
//   onEdit,
//   onDelete,
// }: {
//   companies: Company[];
//   onSelect: (company: Company) => void;
//   onEdit: (company: Company) => void;
//   onDelete: (company: Company) => void;
// }) {
//   return (
//     <div className="space-y-6">
//       {companies.map((company) => (
//         <Card
//           key={company.id}
//           className="p-6 hover:shadow-lg transition cursor-pointer"
//           onClick={() => onSelect(company)}
//         >
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <h3 className="text-xl font-semibold">{company.name}</h3>
//               {company.sector && (
//                 <Badge variant="outline" className="mt-1">{company.sector}</Badge>
//               )}
//             </div>

//             <div className="flex gap-1">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={(e) => {
//                   e.stopPropagation(); // prevents opening drawer
//                   onEdit(company);
//                 }}
//               >
//                 ✏️
//               </Button>

//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={(e) => {
//                   e.stopPropagation(); // prevents opening drawer
//                   onDelete(company);
//                 }}
//               >
//                 🗑️
//               </Button>
//             </div>
//           </div>

//           {/* Company Information Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//             {/* Basic Information */}
//             <div className="space-y-2">
//               <h4 className="font-medium text-muted-foreground">Basic Information</h4>
//               {company.placeOfOffice && (
//                 <div><strong>Place of Office:</strong> {company.placeOfOffice}</div>
//               )}
//               {company.headOffice && (
//                 <div><strong>Headquarters:</strong> {company.headOffice}</div>
//               )}
//               {company.website && (
//                 <div><strong>Website:</strong> <a href={company.website} target="_blank" className="text-blue-500 hover:underline">{company.website}</a></div>
//               )}
//               {company.email && (
//                 <div><strong>Email:</strong> <a href={`mailto:${company.email}`} className="text-blue-500 hover:underline">{company.email}</a></div>
//               )}
//             </div>

//             {/* POC Information */}
//             <div className="space-y-2">
//               <h4 className="font-medium text-muted-foreground">Point of Contact</h4>
//               {company.poc?.name ? (
//                 <div>
//                   <div><strong>Name:</strong> {company.poc.name}</div>
//                   <div><strong>Importance:</strong> {company.poc.importance}</div>
//                 </div>
//               ) : (
//                 <div className="text-muted-foreground">Not specified</div>
//               )}
//             </div>
//           </div>

//           {/* Address Information */}
//           {company.address && (company.address.street || company.address.city || company.address.state || company.address.country || company.address.pincode) && (
//             <div className="mt-4 pt-4 border-t">
//               <h4 className="font-medium text-muted-foreground mb-2">Address</h4>
//               <div className="text-sm space-y-1">
//                 {company.address.street && <div><strong>Street:</strong> {company.address.street}</div>}
//                 {company.address.city && <div><strong>City:</strong> {company.address.city}</div>}
//                 {company.address.state && <div><strong>State:</strong> {company.address.state}</div>}
//                 {company.address.country && <div><strong>Country:</strong> {company.address.country}</div>}
//                 {company.address.pincode && <div><strong>Pin Code:</strong> {company.address.pincode}</div>}
//               </div>
//             </div>
//           )}

//           {/* Contacts Information */}
//           {company.contacts && company.contacts.length > 0 && (
//             <div className="mt-4 pt-4 border-t">
//               <h4 className="font-medium text-muted-foreground mb-2">Contact Persons ({company.contacts.length})</h4>
//               <div className="space-y-3">
//                 {company.contacts.map((contact, index) => (
//                   <div key={index} className="p-3 bg-muted/50 rounded-lg text-sm">
//                     <div className="font-medium">{contact.name}</div>
//                     {contact.role && <div><strong>Role:</strong> {contact.role}</div>}
//                     {contact.phone && <div><strong>Phone:</strong> {contact.phone}</div>}
//                     {contact.email && <div><strong>Email:</strong> <a href={`mailto:${contact.email}`} className="text-blue-500 hover:underline">{contact.email}</a></div>}
//                     {contact.importance && <div><strong>Importance:</strong> {contact.importance}</div>}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </Card>
//       ))}
//     </div>
//   );
// }

"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Company } from "@/types";
import { Pencil, Trash2 } from "lucide-react"; // ✅ added

export default function CompaniesList({
  companies,
  onSelect,
  onEdit,
  onDelete,
}: {
  companies: Company[];
  onSelect: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}) {
  return (
    <div className="space-y-6">
      {companies.map((company) => (
        <Card
          key={company.id}
          className="p-6 hover:shadow-lg transition cursor-pointer"
          onClick={() => onSelect(company)}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">{company.name}</h3>
              {company.sector && (
                <Badge variant="outline" className="mt-1">{company.sector}</Badge>
              )}
            </div>

            <div className="flex gap-2">
              {/* EDIT BUTTON */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(company);
                }}
                className="hover:bg-blue-50"
              >
                <Pencil className="w-5 h-5 text-blue-600" />
              </Button>

              {/* DELETE BUTTON */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(company);
                }}
                className="hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </Button>
            </div>
          </div>

          {/* Company Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {/* Basic Information */}
            <div className="space-y-2">
              <h4 className="font-medium text-muted-foreground">Basic Information</h4>
              {company.placeOfOffice && (
                <div><strong>Place of Office:</strong> {company.placeOfOffice}</div>
              )}
              {company.headOffice && (
                <div><strong>Headquarters:</strong> {company.headOffice}</div>
              )}
              {company.website && (
                <div>
                  <strong>Website:</strong>{" "}
                  <a
                    href={company.website}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    {company.website}
                  </a>
                </div>
              )}
              {company.email && (
                <div>
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${company.email}`}
                    className="text-blue-500 hover:underline"
                  >
                    {company.email}
                  </a>
                </div>
              )}
            </div>

            {/* POC Information */}
            <div className="space-y-2">
              <h4 className="font-medium text-muted-foreground">Point of Contact</h4>
              {company.poc?.name ? (
                <div>
                  <div><strong>Name:</strong> {company.poc.name}</div>
                  <div><strong>Importance:</strong> {company.poc.importance}</div>
                </div>
              ) : (
                <div className="text-muted-foreground">Not specified</div>
              )}
            </div>
          </div>

          {/* Address Information */}
          {((company.address && company.address.trim()) ||
            (company.addressObj && (
              company.addressObj.street ||
              company.addressObj.city ||
              company.addressObj.state ||
              company.addressObj.country ||
              company.addressObj.pincode
            ))) && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium text-muted-foreground mb-2">
                  Address
                </h4>
                <div className="text-sm space-y-1">
                  {company.addressObj?.street && (
                    <div><strong>Street:</strong> {company.addressObj.street}</div>
                  )}
                  {company.addressObj?.city && (
                    <div><strong>City:</strong> {company.addressObj.city}</div>
                  )}
                  {company.addressObj?.state && (
                    <div><strong>State:</strong> {company.addressObj.state}</div>
                  )}
                  {company.addressObj?.country && (
                    <div><strong>Country:</strong> {company.addressObj.country}</div>
                  )}
                  {company.addressObj?.pincode && (
                    <div><strong>Pin Code:</strong> {company.addressObj.pincode}</div>
                  )}
                  {company.address && !company.addressObj?.street && (
                    <div><strong>Address:</strong> {company.address}</div>
                  )}
                </div>
              </div>
            )}

          {/* Contacts */}
          {company.contacts && company.contacts.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium text-muted-foreground mb-2">
                Contact Persons ({company.contacts.length})
              </h4>
              <div className="space-y-3">
                {company.contacts.map((contact, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg text-sm">
                    <div className="font-medium">{contact.name}</div>
                    {contact.role && <div><strong>Role:</strong> {contact.role}</div>}
                    {contact.phone && <div><strong>Phone:</strong> {contact.phone}</div>}
                    {contact.email && (
                      <div>
                        <strong>Email:</strong>{" "}
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-500 hover:underline"
                        >
                          {contact.email}
                        </a>
                      </div>
                    )}
                    {contact.importance && (
                      <div><strong>Importance:</strong> {contact.importance}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
