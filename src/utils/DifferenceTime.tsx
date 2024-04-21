export default function DifferenceTime(timeInput: Date) {
    const updatedTime: any = new Date(timeInput)
    const nowTime: any = new Date()
    const timeDifferenceInMilliseconds: number | null = nowTime - updatedTime
    switch (true) {
        case timeDifferenceInMilliseconds < 1000 * 60:
            return "Vừa xong"
        case timeDifferenceInMilliseconds < 1000 * 60 * 60:
            return Math.floor(timeDifferenceInMilliseconds / (1000 * 60)) + " phút trước"
        case timeDifferenceInMilliseconds < 1000 * 60 * 60 * 24:
            return Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60)) + " giờ trước"
        case timeDifferenceInMilliseconds < 1000 * 60 * 60 * 24 * 30:
            return Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)) + " ngày trước"
        case timeDifferenceInMilliseconds < 1000 * 60 * 60 * 24 * 30 * 12:
            return Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24 * 30)) + " tháng trước"
        default:
            return Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24 * 30 * 12)) + " năm trước"
    }
}