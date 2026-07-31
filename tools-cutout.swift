import Foundation
import Vision
import CoreImage
import AppKit

// Usage: cutout <input.png> <output.png>
let args = CommandLine.arguments
guard args.count >= 3 else { fputs("usage: cutout in out\n", stderr); exit(1) }
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])

guard let ciImage = CIImage(contentsOf: inURL) else {
    fputs("could not read input\n", stderr); exit(1)
}

let handler = VNImageRequestHandler(ciImage: ciImage, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()

do {
    try handler.perform([request])
} catch {
    fputs("vision failed: \(error)\n", stderr); exit(1)
}

guard let result = request.results?.first else {
    fputs("no foreground instance found\n", stderr); exit(1)
}

fputs("instances found: \(result.allInstances.count)\n", stderr)

do {
    // Generate masked image (subject on transparent background), full resolution
    let masked = try result.generateMaskedImage(
        ofInstances: result.allInstances,
        from: handler,
        croppedToInstancesExtent: false
    )
    let ci = CIImage(cvPixelBuffer: masked)
    let ctx = CIContext()
    guard let cg = ctx.createCGImage(ci, from: ci.extent) else {
        fputs("cgimage failed\n", stderr); exit(1)
    }
    let rep = NSBitmapImageRep(cgImage: cg)
    guard let data = rep.representation(using: .png, properties: [:]) else {
        fputs("png encode failed\n", stderr); exit(1)
    }
    try data.write(to: outURL)
    fputs("wrote \(outURL.path) \(cg.width)x\(cg.height)\n", stderr)
} catch {
    fputs("mask generation failed: \(error)\n", stderr); exit(1)
}
