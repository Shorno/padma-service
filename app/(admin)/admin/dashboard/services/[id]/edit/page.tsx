import { notFound } from "next/navigation"
import getServiceById from "../../actions/get-service-by-id"
import EditServiceForm from "./edit-service-form"

interface EditServicePageProps {
    params: Promise<{ id: string }>
}

export default async function EditServicePage({ params }: EditServicePageProps) {
    const { id } = await params
    const serviceId = parseInt(id)

    if (isNaN(serviceId)) {
        notFound()
    }

    const service = await getServiceById(serviceId)

    if (!service) {
        notFound()
    }

    return <EditServiceForm service={service} />
}
